import { respondInternalServerError } from "../helper/response.js";
import axios from "axios";
import Store from "../models/store.js";
import qcCredentials from "../models/qcCredentials.js";
import qc_gc from "../models/qc_gc.js";

export const createGiftcard = async (store, amount, order_id , ExpiryDate) => {
  try {
    console.log(amount, "amount")
    let setting = await qcCredentials.findOne({ store_url: store });
    console.log("------------------store qc credeentials-------------------------",setting , store);
    let transactionId = setting.unique_transaction_id; //Store the unique ID to a variable
      setting.unique_transaction_id = transactionId + 1; // Append it by 1
      setting.markModified("unique_transaction_id");
      await setting.save();
  
    let data = {
      TransactionTypeId: "305",
      InputType: "3",
      TransactionModeId : "0",
      BusinessReferenceNumber: "",
      InvoiceNumber: "ORD-" + order_id,
      NumberOfCards: "1",
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
        DateAtClient: "07/10/2023",
        TransactionId: transactionId,
        Authorization: `Bearer ${process.env.Authorization}`,
      },
      data: data,
    };

   const gcCreation = await axios(config);
   console.log(gcCreation, "******************")
   if (
    gcCreation.status == "200" &&
    gcCreation.data.ResponseCode == "0"
  ) {
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
        DateAtClient: "06/19/2023",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
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
        DateAtClient: "06/22/2023",
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
    await setting.save();
    let data = {
      TransactionTypeId: 3500,
      BusinessReferenceNumber: "",
      InvoiceNumber: "Inv-01",
      Quantity: 1,
      ExecutionMode:"0",
      WalletProgramGroupName : setting.wpgn,
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
        DateAtClient: "06/20/2023",
        TransactionId: transactionId,
        Authorization: `Bearer ${process.env.Authorization}`,
      },
      data: data,
    };

    let walletCreation = await axios(config);
    console.log(walletCreation);
    if (
      (walletCreation.status == "200", walletCreation.data.ResponseCode == "0")
    ) {
      console.log(walletCreation.data);
      return walletCreation.data.Wallets[0];
    }
    else{

    }
  } catch (err) {
    console.log(err);
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
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
    await setting.save();
    
      let data = {
        TransactionTypeId: "3508",
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
          DateAtClient: "06/20/2021",
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
    console.log(gc_pin);
    let data = {
      TransactionTypeId: 322,
      InputType: "1",
      Cards: [{ CardPin: gc_pin }],
      Notes: "Activate Only",
    };

    let config = {
      method: "post",
      url: `${process.env.QC_API_URL}/XNP/api/v3/gc/transactions`,
      headers: {
        "Content-Type": "application/json;charset=UTF-8 ",
        DateAtClient: "07/04/2023",
        TransactionId: transactionId,
        Authorization: `Bearer ${process.env.Authorization}`,
      },
      data: data,
    };

    let activation = await axios(config);
    console.log(activation, "******************")
   if (
    activation.status == "200" &&
    activation.data.ResponseCode == "0"
  ) {
    return activation.data.Cards[0]
  }
  
  } catch (err) {
    console.log(err);
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
      await setting.save();
    let data = {
      TransactionTypeId: 3504,
      InputType:"1",
      PreAuthType:1,
      BusinessReferenceNumber: "",
      InvoiceNumber: "Inv-01",
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
        DateAtClient: "06/20/2023",
        TransactionId: transactionId,
        Authorization: `Bearer ${process.env.Authorization}`,
      },
      data: data,
    };

    let walletRedemption = await axios(config);
    console.log(walletRedemption.data)
    if (
      (walletRedemption.status == "200", walletRedemption.data.ResponseCode == "0")
    ) {
      console.log(walletRedemption.data.Wallets;
      await wallet_history.updateOne({wallet_id :  wallet_id},{$push:{transactions: {transaction_type : "debit" , amount :amount , gc_pin : gc_pin}}}, {upsert:true})

      return walletRedemption.data.Wallets[0];
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};
