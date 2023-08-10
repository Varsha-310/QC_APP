import { respondInternalServerError } from "../helper/response.js";
import axios from "axios";
import Store from "../models/store.js";
import qcCredentials from "../models/qcCredentials.js";
import qc_gc from "../models/qc_gc.js";
import wallet_history from "../models/wallet_history.js";



export const createGiftcard = async (store, amount, order_id , validity) => {

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
    const date = ((myDate).toISOString().slice(0, 10));
    console.log("mydate", myDate, validity)
    myDate.setDate(myDate.getDate() + parseInt(validity));
    const expirydate = ((myDate).toISOString().slice(0, 10));

  
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
          CardProgramGroupName: setting.cpgn,
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
        Authorization: `Bearer ${process.env.Authorization}`,
      },
      data: data,
    };

   const gcCreation = await axios(config);
   console.log(gcCreation, "******************")
   if ( gcCreation.status == "200" &&  gcCreation.data.ResponseCode == "0") {
    
    await updateBilling(amount, store);
    console.log(gcCreation.data.Cards[0], "----------")
    await qc_gc.create({gc_pin :gcCreation.data.Cards[0].CardPin , gc_number : gcCreation.data.Cards[0].CardNumber, balance :gcCreation.data.Cards[0].Balance , expirt_date :gcCreation.data.Cards[0].ExpiryDate})
    return gcCreation.data.Cards[0]
  }

}

  catch (err) {
    console.log(err)
    return false
  }
};

export const qwikcilverToken = () => {
  try {
    let myDate = new Date();
    const date = ((myDate).toISOString().slice(0, 10));
    let data = {
      TerminalId: "QwikPOS-Corporate-01",
      UserName: "ayurmall.intuser",
      Password: "Temp@123",
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.QC_API_URL}/XNP/api/v3/authorize`,
      headers: {
        "Content-Type": "application/json;charset=UTF-8 ",
        DateAtClient: date,
      },
      data: data,
    };

    let token = axios(config);

  } catch (err) {
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};

export const fetchBalance = async (store ,walletData) => {
  try {
    console.log(walletData);
    let setting = await qcCredentials.findOne({ store_url: store });
    console.log("------------------store qc credeentials-------------------------",setting.password, setting.unique_transaction_id);
    let transactionId = setting.unique_transaction_id; //Store the unique ID to a variable
      setting.unique_transaction_id = transactionId + 1; // Append it by 1
      setting.markModified("unique_transaction_id");
      await setting.save();
      let myDate = new Date();
      const date = ((myDate).toISOString().slice(0, 10));
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
        Authorization: `Bearer ${process.env.Authorization}`,
      },
      data: data,
    };

    let walletDetails = await axios(config);
    console.log(walletDetails.data);
    if (
      walletDetails.status == "200" &&
      walletDetails.data.ResponseCode == "0"
    ) {
      let balance = walletDetails.data.Cards[0].Balance;
      console.log(balance, "----------balance-------------------");
      return balance;
    }
  } catch (err) {
    // console.log(err)
    return false;
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
    const date = ((myDate).toISOString().slice(0, 10));
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
        Authorization: `Bearer ${process.env.Authorization}`,
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
    const date = ((myDate).toISOString().slice(0, 10));
    
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
          Authorization: `Bearer ${process.env.Authorization}`,
        },
        data: data,
      };

      let cardAdded = await axios(config);
     console.log(cardAdded.data)
    return cardAdded;
    
  } catch (err) {
    console.log(err)
    console.log(err.response.status, err.response.data.ResponseCode);
    if (err.response.status == 401 && err.response.data.ResponseCode == 10744) {
    }
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
    const date = ((myDate).toISOString().slice(0, 10));
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
        Authorization: `Bearer ${process.env.Authorization}`,
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
    throw Error("Internal Server Error");
  }
};


/**
 * to redeem amount from wallet
 * @param {*} store 
 * @param {*} customer_id 
 * @returns 
 */
export const redeemWallet = async (store ,wallet_id,amount) => {

  try {

    let setting = await qcCredentials.findOne({ store_url: store });
    console.log("------------------store qc credeentials-------------------------",setting.password, setting.unique_transaction_id);
    let transactionId = setting.unique_transaction_id; //Store the unique ID to a variable
      setting.unique_transaction_id = transactionId + 1; // Append it by 1
      setting.markModified("unique_transaction_id");
      const idempotency_key = generateIdempotencyKey();
      await setting.save();
      let myDate = new Date();
      const date = ((myDate).toISOString().slice(0, 10));
    let data = {
      TransactionTypeId: 3504,
      InputType:"1",
      PreAuthType:1,
      BusinessReferenceNumber: "",
      InvoiceNumber: "Inv-01",
      IdempotencyKey: idempotency_key,
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
        Authorization: `Bearer ${process.env.Authorization}`,
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
    setting.unique_transaction_id = ++parseInt(setting.unique_transaction_id); 
    setting.markModified("unique_transaction_id");

    const myDate = new Date();
    const date = ((myDate).toISOString().slice(0, 10));
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
        Authorization: `Bearer ${process.env.Authorization}`,
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

    console.log(err);
    throw Error("Error while reversing the amount");
  }
};


function generateIdempotencyKey() {
  //To create a unique 15 character ID
  var str = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let idempotency_key = "";
  var len = str.length;
  for (let i = 0; i < 15; i++) {
    idempotency_key += str[Math.floor(Math.random() * len)];
  }
  return idempotency_key;
}
