import { respondInternalServerError } from "../helper/response.js";
import axios from "axios";
import qcCredentials from "../models/qcCredentials.js";
import qc_gc from "../models/qc_gc.js";
import wallet_history from "../models/wallet_history.js";
import { updateBilling } from "../controllers/BillingController.js";
import wallet from "../models/wallet.js";

/**
 * method to create giftcard on QC
 * @param {*} store 
 * @param {*} amount 
 * @param {*} order_id 
 * @param {*} validity 
 * @param {*} type 
 * @returns 
 */
export const createGiftcard = async (store, amount, order_id , validity, type) => {

  try {

    console.log(amount, "amount")
    let setting = await qcCredentials.findOne({ store_url: store });
    console.log("------------------store qc credeentials-------------------------",setting , store);
    let idempotency_key = generateIdempotencyKey(); // Get the Idempotency Key
    let transactionId = setting.unique_transaction_id; //Store the unique ID to a variable
    setting.unique_transaction_id = transactionId + 1; // Append it by 1
    setting.markModified("unique_transaction_id");
    await setting.save();

    let myDate = new Date();
    const date = ((myDate).toISOString().slice(0, 22));

    console.log("mydate", myDate, validity)
    myDate.setDate(myDate.getDate() + parseInt(validity));
    const expirydate = ((myDate).toISOString().slice(0, 10));
    let cpgn;
    if(type == "refund"){
     cpgn = setting.refund_cpgn
    }
    else{
	console.log("_------in giftcard type--------", cpgn)
      cpgn = setting.giftcard_cpgn
    }

  console.log("cpgn type" , cpgn , type);  
    let data = {
      TransactionTypeId: "305",
      InputType: "3",
      TransactionModeId : "0",
      BusinessReferenceNumber: "",
      InvoiceNumber: "ORD-" + order_id,
      NumberOfCards: "1",
      IdempotencyKey: idempotency_key,
      Expiry : expirydate,
      Cards: [
        {
          CardProgramGroupName: cpgn,
          Amount: amount,
          CurrencyCode: "INR"
        },
      ],
      Purchaser: {
        FirstName: "varsha",
        LastName: "One",
        Mobile: "+8095379504",
        Email: "testinguser@gmail.com",
      },
      Notes: "CreateAndIssue Testing",
    };

    let config = {
      method: "post",
      url: `${process.env.QC_API_URL}/XNP/api/v3/gc/transactions`,
      headers: {
        "Content-Type": "application/json;charset=UTF-8 ",
        DateAtClient: date,
        TransactionId: transactionId,
        Authorization: `Bearer ${setting.token}`,
      },
      data: data,
    };

   const gcCreation = await axios(config);
   console.log(gcCreation, "******************")
   if ( gcCreation.status == "200" &&  gcCreation.data.ResponseCode == "0") {
    
    await updateBilling(amount, store);
    console.log(gcCreation.data.Cards[0], "----------")
    await qc_gc.create({ store_url : store , gc_pin :gcCreation.data.Cards[0].CardPin , gc_number : gcCreation.data.Cards[0].CardNumber, balance :gcCreation.data.Cards[0].Balance , expiry_date :gcCreation.data.Cards[0].ExpiryDate , order_id : order_id})
    return gcCreation.data.Cards[0]
  }

}

  catch (err) {
    console.log(err);
    if(err.response.status == "401" &&
    err.response.data.ResponseCode == "10744"){
      await authToken(store);
    }
    res.json(
      respondInternalServerError()
    );
  }
};

/**
 * to check QC wallet balance
 * @param {*} store 
 * @param {*} walletData 
 * @returns 
 */
export const fetchBalance = async (store ,walletData) => {
  try {
    // console.log(walletData);
    let setting = await qcCredentials.findOne({ store_url: store });
    console.log("------------------store qc credeentials-------------------------",setting.password, setting.unique_transaction_id , setting.token);
    let transactionId = setting.unique_transaction_id; //Store the unique ID to a variable
      setting.unique_transaction_id = transactionId + 1; // Append it by 1
      setting.markModified("unique_transaction_id");
      await setting.save();
      let myDate = new Date();
      const date = ((myDate).toISOString().slice(0, 22));
      console.log(date)
    let data = {
      TransactionTypeId: 3503,
      InputType: "1",
      Cards: [
        {
          CardNumber: walletData,
          CurrencyCode: "INR",
        },
      ],
      Notes: "Wallet Balance Enquiry",
    };

    let config = {
      method: "post",

      url: `${process.env.QC_API_URL}/XNP/api/v3/gc/transactions`,
      headers: {
        "Content-Type": "application/json;charset=UTF-8 ",
        DateAtClient: date,
        TransactionId: transactionId,
        Authorization:  `Bearer ${setting.token}`,
      },
      data: data,
    };

    let walletDetails = await axios(config);
    console.log(walletDetails);
    
   if (
      walletDetails.status == "200" &&
      walletDetails.data.ResponseCode == "0"
    ) {
      let balance = walletDetails.data.Cards[0].Balance;
      console.log(balance, "----------balance-------------------");
      return balance;
    }
  } catch (err) {
    console.log(err);
    if(err.response.status == "401" &&
    err.response.data.ResponseCode == "10744"){
      console.log( "----------balance-------------------");

      await authToken(store);
    }
    res.json(
      respondInternalServerError()
    );
  }
};

/**
 * To create wallet against customerid
 * @param {*} req
 * @param {*} res
 */
export const createWallet = async (store ,customer_id) => {

  try {

    let setting = await qcCredentials.findOne({ store_url: store });
    let transactionId = setting.unique_transaction_id; //Store the unique ID to a variable
    setting.unique_transaction_id = transactionId + 1; // Append it by 1
    setting.markModified("unique_transaction_id");
    const idempotency_key = generateIdempotencyKey()
    await setting.save();
    let myDate = new Date();
    const date = ((myDate).toISOString().slice(0, 22));

    let data = {
      TransactionTypeId: 3500,
      BusinessReferenceNumber: "",
      InvoiceNumber: "Inv-01",
      Quantity: 1,
      ExecutionMode:"0",
      WalletProgramGroupName : setting.wpgn,
      IdempotencyKey: idempotency_key,
      Wallets: [
        {
          ExternalWalletID: customer_id,
          CurrencyCode: "INR",
        },
      ],
      Notes: "Test Wallet Creation for Testing",
    };

    let config = {
      method: "post",
      url: `${process.env.QC_API_URL}/XnP/api/v3/wallets`,
      headers: {
        "Content-Type": "application/json;charset=UTF-8 ",
        DateAtClient: date,
        TransactionId: transactionId,
        Authorization: `Bearer ${setting.token}`,
      },
      data: data,
    };

    let walletCreation = await axios(config);
    console.log("Wallet data",walletCreation.status, walletCreation.data);
    if (
      (walletCreation.status == "200", walletCreation.data.ResponseCode == "0")
    ) {
      return walletCreation.data.Wallets[0];
    }
    else{
      console.log("Wallet Error", walletCreation);
    }
  } catch (err) {
    console.log(err);
    if(err.response.status == "401" &&
    err.response.data.ResponseCode == "10744"){
      await authToken(store);
    }
    throw Error("Internal Server Error");
  }
};

/**
 * to call qc api to add giftcard to wallet
 * @param {*} wallet_id
 * @param {*} gc_pin
 */
export const addToWallet = async (store ,wallet_id, gc_pin, gc_number) => {
  try {
 
 
    let setting = await qcCredentials.findOne({store_url : store});
    console.log(store , setting , "---------------add to wallet----------------------------------------")
    let transactionId = setting.unique_transaction_id; //Store the unique ID to a variable
    setting.unique_transaction_id = transactionId + 1; // Append it by 1
    setting.markModified("unique_transaction_id");
    const idempotency_key = generateIdempotencyKey();
    await setting.save();
    let myDate = new Date();
    const date = ((myDate).toISOString().slice(0, 22));

      let data = {
        TransactionTypeId: "3508",
        IdempotencyKey: idempotency_key,
        Cards: [
          {
            CardNumber: wallet_id,
            PaymentInstruments: [
              {
                InstrumentNumber: gc_number,
                InstrumentPin: gc_pin,
              },
            ],
          },
        ],
        Notes: "Test Add Card to Wallet",
      };

      let config = {
        method: "post",
        url: `${process.env.QC_API_URL}/XNP/api/v3/gc/transactions`,
        headers: {
          "Content-Type": "application/json;charset=UTF-8 ",
          DateAtClient: date,
          TransactionId: transactionId,
          Authorization: `Bearer ${setting.token}`,
        },
        data: data,
      };

      let cardAdded = await axios(config);
     console.log(cardAdded.data)
    return cardAdded;
  
    
  } catch (err) {
    console.log(err);
    if(err.response.status == "401" &&
    err.response.data.ResponseCode == "10744"){
      await authToken(store);
    }
    return false
  }
};

/**
 * method to activate giftcard
 * @param {*} gc_pin
 * @returns
 */
export const activateCard = async (store ,gc_pin) => {

  try {

    let setting = await qcCredentials.findOne({ store_url: store });
    console.log("------------------store qc credeentials-------------------------", setting.unique_transaction_id);
    let transactionId = setting.unique_transaction_id; //Store the unique ID to a variable
      setting.unique_transaction_id = transactionId + 1; // Append it by 1
      setting.markModified("unique_transaction_id");
      await setting.save();
      const idempotency_key = generateIdempotencyKey();
    console.log(gc_pin);
    let myDate = new Date();
    const date = ((myDate).toISOString().slice(0, 22));

    let data = {
      TransactionTypeId: 322,
      InputType: "1",
      IdempotencyKey: idempotency_key,
      Cards: [{ CardPin: gc_pin }],
      Notes: "Activate Only",
    };

    let config = {
      method: "post",
      url: `${process.env.QC_API_URL}/XNP/api/v3/gc/transactions`,
      headers: {
        "Content-Type": "application/json;charset=UTF-8 ",
        DateAtClient: date,
        TransactionId: transactionId,
        Authorization: `Bearer ${setting.token}`,
      },
      data: data,
    };

    let activation = await axios(config);
    console.log(activation.data, "******************");
   if (
      activation.status == "200" &&
      activation.data.ResponseCode == "0"
    ) {
      return activation.data.Cards[0]
    }
  } catch (err) {

    console.log(err);
    if(err.response.status == "401" &&
    err.response.data.ResponseCode == "10744"){
      await authToken(store);
    }
    throw Error("Internal Server Error");
  }
};


/**
 * to redeem amount from wallet
 * @param {*} store 
 * @param {*} customer_id 
 * @returns 
 */
export const redeemWallet = async (store ,wallet_id,amount , bill_amount) => {

  try {

    let setting = await qcCredentials.findOne({ store_url: store });
    console.log("------------------store qc credeentials-------------------------",setting.password, setting.unique_transaction_id);
    let transactionId = setting.unique_transaction_id; //Store the unique ID to a variable
      setting.unique_transaction_id = transactionId + 1; // Append it by 1
      setting.markModified("unique_transaction_id");
      const idempotency_key = generateIdempotencyKey();
      await setting.save();
      let myDate = new Date();
      const date = ((myDate).toISOString().slice(0, 22));

    let data = {
      TransactionTypeId: 3504,
      InputType:"1",
      PreAuthType:1,
      BusinessReferenceNumber: "",
      InvoiceNumber: "Inv-01",
      IdempotencyKey: idempotency_key,
      BillAmount : bill_amount,
      Quantity: 1,
         Cards:[{  
        CardNumber:wallet_id,
        CurrencyCode:"INR",
        Amount: amount
      }],
      Notes: "Test Wallet Redeem for Testing",
    };

    let config = {
      method: "post",
      url: `${process.env.QC_API_URL}/XnP/api/v3/gc/transactions`,
      headers: {
        "Content-Type": "application/json;charset=UTF-8 ",
        DateAtClient: date,
        TransactionId: transactionId,
        Authorization: `Bearer ${setting.token}`,
      },
      data: data,
    };

    let walletRedemption = await axios(config);
    console.log(walletRedemption.data)
    if (walletRedemption.status == "200", walletRedemption.data.ResponseCode == "0") {

      console.log(walletRedemption.data.Wallets);
      await wallet_history.updateOne({wallet_id: wallet_id},{$push:{transactions: {transaction_type : "debit" , amount :amount , transaction_date:Date.now()}}}, {upsert:true});
      return walletRedemption.data.Wallets;
    }
  } catch (err) {
    console.log(err);
    if(err.response.status == "401" &&
    err.response.data.ResponseCode == "10744"){
      await authToken(store);
    }
    return false;
  }
};


/**
 *Handle reverse redeem action
 * 
 * @param {*} store 
 * @param {*} wallet_id 
 * @param {*} amount 
 * @returns 
 */
export const reverseRedeemWallet = async (store ,gc_id, amount) => {
  
  try {

    const giftcardExists = await wallet.findOne({ shopify_giftcard_id: gc_id});
    if(giftcardExists) return null;
    
    const setting = await qcCredentials.findOne({ store_url: store });
    setting.unique_transaction_id = parseInt(setting.unique_transaction_id) + 1; 
    setting.markModified("unique_transaction_id");
    const myDate = new Date();
    const date = ((myDate).toISOString().slice(0, 22));

    const data = {
      InputType:"1",
      Cards:[{  
        CardNumber:giftcardExists.wallet_id,
        CurrencyCode:"INR",
        Amount: amount
      }],
      Notes: "Test Wallet Reverse Redeem for Testing",
    };

    const config = {
      method: "post",
      url: `${process.env.QC_API_URL}/XnP/api/v3/gc/transactions/reverse`,
      headers: {
        "Content-Type": "application/json;charset=UTF-8 ",
        DateAtClient: date,
        TransactionId: setting.unique_transaction_id,
        Authorization: `Bearer ${setting.token}`,
      },
      data: data,
    };

    const walletRedemption = await axios(config);
    console.log(walletRedemption.data)
    if (walletRedemption.status == "200", walletRedemption.data.ResponseCode == "0") {

      await wallet_history.updateOne({wallet_id: giftcardExists.wallet_id},{$push:{transactions: {transaction_type : "credit" , amount :amount , transaction_date:Date.now()}}}, {upsert:true});
      return walletRedemption.data;
    }
    await setting.save();
  } catch (err) {
    if(err.response.status == "401" &&
    err.response.data.ResponseCode == "10744"){
      await authToken(store);
    }
    console.log(err);
    throw Error("Error while reversing the amount");
  }
};

/**
 * method to get auth token
 * @param {*} store 
 * @returns 
 */
export const authToken = async (store)=> {
  try{
    console.log("--------------in creating token-----------------------")
    const storeData = await qcCredentials.findOne({store_url : store});
    const myDate = new Date();
    const date = ((myDate).toISOString().slice(0, 22));

    console.log(storeData)

let data = {
  "TerminalId": storeData.terminal_id,
  "UserName": storeData.username,
  "Password" : storeData.password

} 

let config = {
  method: 'post',
  url: `${process.env.QC_API_URL}/XnP/api/v3/authorize`,
  headers: { 
    'Content-Type': 'application/json;charset=UTF-8', 
    'DateAtClient': date
  },
  data : data
};

const authData = await axios(config);
console.log(authData.data)
if (authData.status == "200", authData.data.ResponseCode == "0") {
  await qcCredentials.updateOne({store_url: store}, {token : authData.data.AuthToken}, {upsert: true});
  return true;

}
  }
  catch(err){
    console.log(err);
    return false

  }
}

/**
 * to create idempotency key
 * @returns 
 */
const  generateIdempotencyKey = ()=> {
  //To create a unique 15 character ID
  var str = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let idempotency_key = "";
  var len = str.length;
  for (let i = 0; i < 15; i++) {
    idempotency_key += str[Math.floor(Math.random() * len)];
  }
  return idempotency_key;
}
