import { respondInternalServerError } from "../helper/response.js";
import axios from "../helper/axios.js";
import qcCredentials from "../models/qcCredentials.js";
import qc_gc from "../models/qc_gc.js";
import wallet_history from "../models/wallet_history.js";
import { updateBilling } from "../controllers/BillingController.js";
import Wallet from "../models/wallet.js";
import orders from "../models/orders.js";
import OrderCreateEventLog from "../models/OrderCreateEventLog.js";
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
export const createGiftcard = async (
  store,
  amount,
  order_id,
  validity,
  type,
  customer = {},
  logs = {}
) => {

  logs["status"] = false;
  try {

    console.log( "------------------ Create Giftcard Process Started -------------------");
    let setting = await qcCredentials.findOne({ store_url: store });
    let idempotency_key = generateIdempotencyKey(); // Get the Idempotency Key
    let transactionId = setting.unique_transaction_id; //Store the unique ID to a variable
    setting.unique_transaction_id = transactionId + 1; // Append it by 1
    setting.markModified("unique_transaction_id");
    await setting.save();

    let myDate = new Date();
    const date = myDate.toISOString().slice(0, 22);
    console.log("mydate", myDate, validity);

    myDate.setDate(myDate.getDate() + parseInt(validity));
    const expirydate = myDate.toISOString().slice(0, 10);
    let cpgn;
    if (type == "refund") {
      cpgn = setting.refund_cpgn;
    } else {
      console.log("_------in giftcard type--------", cpgn);
      cpgn = setting.giftcard_cpgn;
    }
    let data = logs?.req ? logs.req : {
      TransactionTypeId: "305",
      InputType: "3",
      TransactionModeId: "0",
      BusinessReferenceNumber: "",
      InvoiceNumber: `ORD-${order_id}`,
      NumberOfCards: "1",
      IdempotencyKey: idempotency_key,
      Expiry: expirydate,
      Cards: [{
          CardProgramGroupName: cpgn,
          Amount: amount,
          CurrencyCode: "INR",
      }],
      Purchaser: {
        FirstName: customer?.first_name || "First Name",
        LastName: customer?.last_name || "Last Name",
        Mobile: customer?.phone || "1111111111",
        Email: customer?.email || "testinguser@qwikcilver.com",
      },
    };
    logs["req"] = data;
    let config = {
      method: "post",
      url: `${process.env.QC_API_URL}/XNP/api/v3/gc/transactions`,
      headers: {
        TransactionId: transactionId,
        Authorization: `Bearer ${setting.token}`,
      },
      data: data,
      checkAuth: {store, n:1}
    };

    const gcCreation = await axios(config);
    console.log(" Response Code : ", gcCreation.data.ResponseCode);
    logs["resp"] = gcCreation.data;
    if (gcCreation.status == "200") {
      if (!logs?.updateBillingAt) {

        await updateBilling(amount, store);
        logs["updateBillingAt"] = new Date().toISOString();
      }
      console.log("Card Details: ", gcCreation.data.Cards[0]);
      if (!logs?.qcUpdatedToDB) {
        await qc_gc.create({
          store_url: store,
          gc_pin: gcCreation.data.Cards[0].CardPin,
          gc_number: gcCreation.data.Cards[0].CardNumber,
          balance: gcCreation.data.Cards[0].Balance,
          expiry_date: gcCreation.data.Cards[0].ExpiryDate,
          order_id: order_id,
        });
        logs["qcUpdatedToDB"] = new Date().toISOString();
      }

      logs["resp"] = gcCreation.data;
      logs["status"] = true;
      //return type == "giftcard" ? logs : gcCreation.data.Cards[0];
    }
    return logs;
  } catch (err) {
    
    console.log(" --- Error While Creating Giftcard ---", err);
    logs["error"] = err?.response?.data || err?.code;
    return logs;
  }
};

/**
 * method to cancle created & issued giftcard on QC
 * @param {*} store
 * @param {*} amount
 * @param {*} order_id
 * @param {*} validity
 * @param {*} type
 * @returns
 */
export const cancelCreateNdIssueGiftcard = async (
  store,
  cardResp,
  logs = {}
) => {

  logs["status"] = false;
  try {

    console.log( "------------------ Create Giftcard Process Started -------------------");
    let setting = await qcCredentials.findOne({ store_url: store });
    let transactionId = setting.unique_transaction_id; //Store the unique ID to a variable
    setting.unique_transaction_id = transactionId + 1; // Append it by 1
    setting.markModified("unique_transaction_id");
    await setting.save();

    let data = {
        "InputType": 1,
        "Cards": [
            {
                "CardNumber": cardResp.Cards[0].CardNumber,
                "CurrencyCode": cardResp.Cards[0].CurrencyCode,
                "Amount": cardResp.Cards[0].Balance,
                "OriginalRequest": {
                    "OriginalBatchNumber": cardResp.CurrentBatchNumber,
                    "OriginalTransactionId": cardResp.TransactionId,
                    "OriginalApprovalCode": cardResp.Cards[0].ApprovalCode
                }
            }
        ]
    };
    logs["req"] = data;
    let config = {
      method: "post",
      url: `${process.env.QC_API_URL}/XNP/api/v3/transactions/cancel`,
      headers: {
        TransactionId: transactionId,
        Authorization: `Bearer ${setting.token}`,
      },
      data: data,
      checkAuth: {store, n:1}
    };

    const resp = await axios(config);
    logs["resp"] = resp.data;
    logs["status"] = true;
    return logs;
  } catch (err) {
    
    logs["status"] = true;
    logs["error"] = err?.response?.data || err?.code;
    return logs;
  }
};

/**
 * to check QC wallet balance
 * @param {*} store
 * @param {*} walletData
 * @returns
 */
export const fetchBalance = async (store, walletData) => {
  try {
    // console.log(walletData);
    let setting = await qcCredentials.findOne({ store_url: store });
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
    };

    let config = {
      method: "post",
      url: `${process.env.QC_API_URL}/XNP/api/v3/gc/transactions`,
      headers: {
        TransactionId: transactionId,
        Authorization: `Bearer ${setting.token}`,
      },
      data: data,
      checkAuth: {store, n:1}
    };
    console.log("----fetch balance config----------", config);
    let walletDetails = await axios(config);
    if (walletDetails.data.ResponseCode == "0") {

      return walletDetails.data.Cards[0].Balance;
    }
  } catch (err) {

    console.log(err);
    throw new Error("Internal Server Error");
  }
};

/**
 * To check wallet against customerid
 * @param {*} req
 * @param {*} res
 */
export const checkWalletOnQC = async (store, customer_id, logs = {}) => {
  
  logs["status"] = 0;
  try {

    let setting = await qcCredentials.findOne({ store_url: store });
    let transactionId = setting.unique_transaction_id; 
    setting.unique_transaction_id = transactionId + 1;
    setting.markModified("unique_transaction_id");
    await setting.save();

    let data = {
        "TransactionTypeId": 3501,
        "Quantity": 1,
        "Wallets": [
            {
                "ExternalWalletId": customer_id
            }
        ]
    };
    logs["req"] = data;
    let config = {
      method: "post",
      url: `${process.env.QC_API_URL}/XnP/api/v3/wallets`,
      headers: {
        TransactionId: transactionId,
        Authorization: `Bearer ${setting.token}`,
      },
      data: JSON.stringify(data),
      checkAuth: {store, n:1}
    };
    let walletCreation = await axios(config);
    console.log("Response: ",  walletCreation);
    logs["resp"] = walletCreation?.data;
    logs["status"] = walletCreation?.data?.ResponseCode == "0" ? 200 : 404;
    return logs;
  } catch (err) {
    console.log(err, "error in qc wallet")
    //console.log("Error : ----- ", JSON.stringify(err.response?.data));
    logs["error"] = err.response?.data;
    logs["status"] = 1;
    return logs;
  }
};

/**
 * Load wallet api to activate and add card to wallet
 * @param {*} req
 * @param {*} res
 */
export const loadWalletAPI = async (store, amount, order_id, customerId, logs = {}) => {
  
  logs["status"] = false;
  try {

    let setting = await qcCredentials.findOne({ store_url: store });
    let transactionId = setting.unique_transaction_id; 
    setting.unique_transaction_id = transactionId + 1;
    setting.markModified("unique_transaction_id");
    await setting.save();

    let idempotency_key = generateIdempotencyKey();
    const wallet = await Wallet.findOne({shopify_customer_id: customerId, store_url: store}, {wallet_id: 1});
    console.log("Walllet: ", wallet);

    let myDate = new Date()
    myDate.setDate(myDate.getDate() + parseInt(365));

    let data = logs?.req
      ? logs.req
      : {
        "TransactionTypeId": 3508,
        "IdempotencyKey": idempotency_key,
        "TransactionModeId": 0,
        "InvoiceNumber": `ORD-${order_id}`,
        "ExecutionMode": 0,
        "Cards": [
            {
                "CardNumber":  wallet.wallet_id,
                "CurrencyCode": "INR",
                "PaymentInstruments": [
                    {
                        "InstrumentProgram": setting.refund_cpgn,
                        "Amount": amount
                    }
                ]
            }
        ]
    };
    logs["req"] = data;
    let config = {
      method: "post",
      url: `${process.env.QC_API_URL}/XnP/api/v3/gc/transactions`,
      headers: {
        TransactionId: transactionId,
        Authorization: `Bearer ${setting.token}`,
      },
      data: data,
      checkAuth: {store, n:1}
    };
    let walletCreation = await axios(config);
    logs["resp"] = walletCreation?.data;
    // console.log(walletCreation?.data);
    if (walletCreation?.data?.ResponseCode == "0") {
      logs["status"] = true;
    }
    return logs;
  } catch (err) {

    console.log("Error: Load Wallet API - ", JSON.stringify(err));
    logs["error"] = err?.response?.data || err?.code;
    return logs;
  }
};

/**
 * cancel Load wallet api to deactivate and remove card from wallet
 * 
 * @param {*} store 
 * @param {*} cardResp 
 * @param {*} customerId 
 * @param {*} logs 
 * @returns 
 */
export const cancelLoadWalletAPI = async (store, cardResp, customerId, logs = {}) => {
  
  logs["status"] = false;
  try {

    if(cardResp == undefined){
      console.log("Load Balance Response Found");
      logs["status"] = true;
      return logs;
    }

    console.log("Cancel Load Wallet API called", store, cardResp, customerId);
    let setting = await qcCredentials.findOne({ store_url: store });
    let transactionId = setting.unique_transaction_id; 
    setting.unique_transaction_id = transactionId + 1;
    setting.markModified("unique_transaction_id");
    await setting.save();

    const idempotency_key = generateIdempotencyKey();

    const wallet = await Wallet.findOne({shopify_customer_id: customerId, store_url: store}, {wallet_id: 1});
    
    console.log(wallet);
    const req = {
      "TransactionTypeId": 3508,
      "InputType": 1,
      "IdempotencyKey": idempotency_key,
      "Cards": [
        {
          "CardNumber": wallet.wallet_id,
          "OriginalRequest": {
              "OriginalBatchNumber": cardResp.CurrentBatchNumber,
              "OriginalTransactionId": cardResp.TransactionId
          }
        }
      ]
    };
    console.log("Req: ", req);
    logs["req"] = req; 
    let config = {
      method: "post",
      url: `${process.env.QC_API_URL}/XnP/api/v3/gc/transactions/cancel`,
      headers: {
        TransactionId: transactionId,
        Authorization: `Bearer ${setting.token}`,
      },
      data: req,
      checkAuth: {store, n:1}
    };
    let walletCreation = await axios(config);
    console.log("Response", JSON.stringify(walletCreation.data));
    logs["resp"] = walletCreation?.data;
    logs["status"] = true;
    return logs;
  } catch (err) {

    console.log(err);
    logs["status"] = true;
    logs["error"] = err?.response?.data || err.code;
    return logs;
  }
};

/**
 * To create wallet against customerid
 * @param {*} req
 * @param {*} res
 */
export const createWallet = async (store, customer_id, order_id, logs = {}) => {

  logs["status"] = false;
  try {

    let setting = await qcCredentials.findOne({ store_url: store });
    let transactionId = setting.unique_transaction_id; //Store the unique ID to a variable
    setting.unique_transaction_id = transactionId + 1; // Append it by 1
    setting.markModified("unique_transaction_id");
    const idempotency_key = generateIdempotencyKey();
    await setting.save();

    let data = logs?.req
      ? logs.req
      : {
          TransactionTypeId: 3500,
          BusinessReferenceNumber: "",
          InvoiceNumber: `ORD-${order_id}`,
          Quantity: 1,
          ExecutionMode: "0",
          WalletProgramGroupName: setting.wpgn,
          IdempotencyKey: idempotency_key,
          Wallets: [
            {
              ExternalWalletID: customer_id,
              CurrencyCode: "INR",
            },
          ],
        };
    logs["req"] = data;
    let config = {
      method: "post",
      url: `${process.env.QC_API_URL}/XnP/api/v3/wallets`,
      headers: {
        TransactionId: transactionId,
        Authorization: `Bearer ${setting.token}`,
      },
      data: data,
      checkAuth: {store, n:1}
    };
    let walletCreation = await axios(config);
    logs["resp"] = walletCreation?.data;
    if ( walletCreation.data.ResponseCode == "0") {
      logs["status"] = true;
    }
    return logs;
  } catch (err) {
  
    logs["error"] = err?.response?.data || err?.code;
    return logs;
  }
};

/**
 * to call qc api to add giftcard to wallet
 * @param {*} wallet_id
 * @param {*} gc_pin
 */
export const addToWallet = async (
  store,
  wallet_id,
  gc_pin,
  gc_number,
  logs = {}
) => {
  logs["status"] = false;
  try {

    let setting = await qcCredentials.findOne({ store_url: store });
    console.log("---------------add to wallet----------------------------------------");
    let transactionId = setting.unique_transaction_id; //Store the unique ID to a variable
    setting.unique_transaction_id = transactionId + 1; // Append it by 1
    setting.markModified("unique_transaction_id");
    const idempotency_key = generateIdempotencyKey();
    await setting.save();
    let data = logs?.req
      ? logs.req
      : {
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
        };

    logs["req"] = data;
    let config = {
      method: "post",
      url: `${process.env.QC_API_URL}/XNP/api/v3/gc/transactions`,
      headers: {
        TransactionId: transactionId,
        Authorization: `Bearer ${setting.token}`,
      },
      data: data,
      checkAuth: {store, n:1}
    };

    let cardAdded = await axios(config);
    //console.log(cardAdded);
    logs["resp"] = cardAdded?.data;
    if (cardAdded.data.ResponseCode == "0")
      logs["status"] = true;

    return logs;
  } catch (err) {
    
    console.log(err);
    logs["error"] = err.response.data || err?.code;
    return logs;
  }
};

/**
 * method to activate giftcard
 * @param {*} gc_pin
 * @returns
 */
export const activateCard = async (store, gc_pin, logs = {}) => {

  logs["status"] = false;
  try {
    let setting = await qcCredentials.findOne({ store_url: store });
    console.log("------------------store qc credeentials-------------------------");
    let transactionId = setting.unique_transaction_id; //Store the unique ID to a variable
    setting.unique_transaction_id = transactionId + 1; // Append it by 1
    setting.markModified("unique_transaction_id");
    await setting.save();
    const idempotency_key = generateIdempotencyKey();
    console.log(gc_pin);
    let myDate = new Date();
    const date = myDate.toISOString().slice(0, 22);
    let data = logs?.req
      ? logs?.req
      : {
          TransactionTypeId: 322,
          InputType: "1",
          IdempotencyKey: idempotency_key,
          Cards: [{ CardPin: gc_pin }],
        };

    logs["req"] = data;
    let config = {
      method: "post",
      url: `${process.env.QC_API_URL}/XNP/api/v3/gc/transactions`,
      headers: {
        TransactionId: transactionId,
        Authorization: `Bearer ${setting.token}`,
      },
      data: data,
      checkAuth: {store, n:1}
    };

    let activation = await axios(config);
    logs["resp"] = activation?.data;
    if (activation.data.ResponseCode == "0") {
      logs["status"] = true;
    }
    return logs;
  } catch (err) {
    
    logs["error"] = err.response.data || err?.code;
    return logs;
  }
};

/**
 * to redeem amount from wallet
 * @param {*} store
 * @param {*} customer_id
 * @returns
 */
export const redeemWallet = async (
  store,
  wallet_id,
  amount,
  bill_amount,
  id,
  logs = {}
) => {
  logs["status"] = false;
  try {

    let setting = await qcCredentials.findOne({ store_url: store });
    console.log("------------------store qc credeentials-------------------------");
    let transactionId = logs?.resp?.TransactionId || setting.unique_transaction_id; //Store the unique ID to a variable
    setting.unique_transaction_id = transactionId + 1; // Append it by 1
    setting.markModified("unique_transaction_id");
    const idempotency_key = generateIdempotencyKey();
    await setting.save();

    let data = logs?.req
      ? logs.req
      : {
          TransactionTypeId: 3504,
          InputType: "1",
          BusinessReferenceNumber: "",
          InvoiceNumber: `ORD-${id}`,
          IdempotencyKey: idempotency_key,
          BillAmount: bill_amount,
          Quantity: 1,
          Cards: [
            {
              CardNumber: wallet_id,
              CurrencyCode: "INR",
              Amount: amount,
            },
          ],
        };

    logs["req"] = data;
    let config = {
      method: "post",
      url: `${process.env.QC_API_URL}/XnP/api/v3/gc/transactions`,
      headers: {
        TransactionId: transactionId,
        Authorization: `Bearer ${setting.token}`,
      },
      data: data,
      checkAuth: {store, n:1}
    };
    let walletRedemption = await axios(config);
    logs["resp"] = walletRedemption?.data;
    if (walletRedemption?.data.ResponseCode == "0") {

      console.log("redeem successfull");
      await wallet_history.updateOne(
        { wallet_id: wallet_id },
        {
          $push: {
            transactions: {
              transaction_type: "debit",
              amount: amount,
              transaction_date: Date.now(),
            },
          },
        },
        { upsert: true }
      );
      logs["status"] = true;
    }else if(walletRedemption?.data.ResponseCode == 10838 && walletRedemption.data?.Cards[0].ResponseCode == 10010){

      logs["status"] = "insufficient";
      logs["error"] = "Balance is insufficient.";
    }
    else if(walletRedemption?.data.ResponseCode == 10867){
      logs["status"] = "timeout";
    }else{
      logs["status"] = "config";
      logs["error"] = "Configuraiton Eroor";
    }
    return logs;
  } catch (err) {

    logs["error"] = err?.response?.data;
    if(err?.code == 'ECONNABORTED'){

      logs["status"] = "timeout";
      logs["error"] = "Timeout Error";
    }
    return logs;
  }
};

/**
 *Handle cancel redeem action
 *
 * @param {*} store
 * @param {*} wallet_id
 * @param {*} amount
 * @returns
 */
export const cancelRedeemWallet = async (
  store,
  gc_id,
  amount,
  order_id,
  txn_id,
  logs = {}
) => {

  console.log("--------------------- Cancle Redeem Balance Process Started -----------------------");
  logs["status"] = false;
  try {

    console.log(store, gc_id, amount, order_id );
    const string_id = gc_id.toString();
    const giftcardExists = await wallet.findOne({
      shopify_giftcard_id: string_id,
    });
    if (giftcardExists) {

      const redeemData = await OrderCreateEventLog.findOne({
        store: store,
        orderId: order_id,
      });
      const setting = await qcCredentials.findOne({ store_url: store });
      let transactionId = setting.unique_transaction_id; //Store the unique ID to a variable
      setting.unique_transaction_id = transactionId + 1; // Append it by 1
      setting.markModified("unique_transaction_id");
      const idempotency_key = generateIdempotencyKey();
      const myDate = new Date();
      const date = myDate.toISOString().slice(0, 22);
      const data = logs?.req ? logs.req : {
        TransactionTypeId: 3504,
        IdempotencyKey: idempotency_key,
        Cards: [
          {
            CardNumber: giftcardExists.wallet_id,
            CurrencyCode: "INR",
            Amount: amount,
            OriginalRequest: {
              OriginalBatchNumber: redeemData.redeem.resp.CurrentBatchNumber,
              OriginalTransactionId: txn_id,
              OriginalInvoiceNumber: redeemData.redeem.resp.Cards[0].InvoiceNumber,
              OriginalApprovalCode: redeemData.redeem.resp.Cards[0].ApprovalCode,
            },
          },
        ],
      };

      logs["req"] = data;
      const config = {
        method: "post",
        url: `${process.env.QC_API_URL}/XnP/api/v3/gc/transactions/cancel`,
        headers: {
          "Content-Type": "application/json;charset=UTF-8 ",
          DateAtClient: date,
          TransactionId: transactionId,
          Authorization: `Bearer ${setting.token}`,
        },
        data: data,
        checkAuth: {store, n:1}
      };

      const walletRedemption = await axios(config);
      console.log("QC - Response Code - ", walletRedemption.data.ResponseCode);
      logs["resp"] = walletRedemption?.data;
      if (walletRedemption.status == "200" && walletRedemption.data.ResponseCode == "0") {
        
        logs["status"] = true;
        await wallet_history.updateOne(
          { wallet_id: giftcardExists.wallet_id },
          {
            $push: {
              transactions: {
                transaction_type: "credit",
                amount: amount,
                type: "refund",
                transaction_date: Date.now(),
              },
            },
          },
          { upsert: true }
        );
        //return walletRedemption.data;
      }
      await setting.save();
      return logs;
    }
  } catch (err) {
    
    logs["error"] = err.response.data || err?.code;
    return logs;
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
 export const reverseRedeemWallet = async (
  store,
  order_id,
  bill_amount,
  wallet_id,
  amount,
  txn_id,
  logs = {}
) => {

  console.log("---------------------Reverse  Redeem Balance Process Started -----------------------");
  logs["status"] = false;
  try {

    console.log(store, wallet_id, amount, order_id );

      const setting = await qcCredentials.findOne({ store_url: store });
      const idempotency_key = generateIdempotencyKey();
      const myDate = new Date();
      const date = myDate.toISOString().slice(0, 22);
      const data = logs?.req ? logs.req : {
        TransactionTypeId: 3504,
        IdempotencyKey: idempotency_key,
        BillAmount: bill_amount,
        Cards: [
          {
            CardNumber: wallet_id,
            CurrencyCode: "INR",
            Amount: amount,
          },
        ],
      };
      logs["req"] = data;
      const config = {
        method: "post",
        url: `${process.env.QC_API_URL}/XnP/api/v3/gc/transactions/reverse`,
        headers: {
          "Content-Type": "application/json;charset=UTF-8 ",
          DateAtClient: date,
          TransactionId: txn_id,
          Authorization: `Bearer ${setting.token}`,
        },
        data: data,
        checkAuth: {store, n:1}
      };
      const walletRedemption = await axios(config);
      console.log("QC - Response Code - ", walletRedemption.data.ResponseCode);
      logs["resp"] = walletRedemption?.data;
      if(walletRedemption.data.ResponseCode == "0") {
        
        logs["status"] = true;
      }
      await setting.save();
      return logs;
  } catch (err) {
    console.log(err ,"error")
    
    logs["error"] = err.response.data || err?.code == 'ECONNABORTED';
    return logs;
  }
};


/**
 * method to get auth token
 * @param {*} store
 * @returns
 */
export const authToken = async (store) => {

  try {
    
    console.log("--------------in creating token-----------------------", store);
    const storeData = await qcCredentials.findOne({ store_url: store });
    const myDate = new Date();
    const date = myDate.toISOString().slice(0, 22);
    let data = {
      TerminalId: storeData.terminal_id,
      UserName: storeData.username,
      Password: storeData.password,
    };
    let config = {
      method: "post",
      url: `${process.env.QC_API_URL}/XnP/api/v3/authorize`,
      data: data,
      checkAuth: {store, n:1}
    };

    const authData = await axios(config);
    //console.log(authData.data);
    if (authData.data.ResponseCode == "0") {
      await qcCredentials.updateOne(
        { store_url: store },
        { token: authData.data.AuthToken },
        { upsert: true }
      );
      return authData.data.AuthToken;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

/**
 * to create idempotency key
 * @returns
 */
const generateIdempotencyKey = () => {
  //To create a unique 15 character ID
  var str = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let idempotency_key = "";
  var len = str.length;
  for (let i = 0; i < 15; i++) {
    idempotency_key += str[Math.floor(Math.random() * len)];
  }
  return idempotency_key;
};
