import { respondInternalServerError } from "../helper/response";
import axios from "axios";
import store from "../models/store";

export const createGiftcard = async () => {
  try {
    let setting = await store.findOne({ store_url: store });
    let transactionId = setting.qwikcilver_account.unique_transaction_id;
    let data = {
      TransactionTypeId: "305",
      InputType: "3",
      BusinessReferenceNumber: "",
      InvoiceNumber: "ORD-" + order_id,
      NumberOfCards: "1",
      Cards: [
        {
          CardProgramGroupName: setting.qwikcilver_account.CardProgramGroupName,
          Amount: Amount,
          CurrencyCode: "INR",
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
        DateAtClient: "06/19/2023",
        TransactionId: transactionId,
        Authorization: "",
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

const qwikcilverToken = () => {
  try {
    let data = {
      TerminalId: "QwikPOS-Corporate-01",
      UserName: "ayurmall.intuser",
      Password: "Temp@123",
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://qc3.qwikcilver.com/QwikCilver/XNP/api/v3/authorize",
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

export const fetchBalance = async (walletData) => {
  try {
    console.log(walletData);
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

      url: "https://qc3.qwikcilver.com/QwikCilver/XnP/api/v3/gc/transactions",
      headers: {
        "Content-Type": "application/json;charset=UTF-8 ",
        DateAtClient: "06/22/2023",
        TransactionId: "024226",
        Authorization: `Bearer ${process.env.Authorization}`,
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
    // console.log(err)
    return false;
  }
};

/**
 * To create wallet against customerid
 * @param {*} req
 * @param {*} res
 */
export const createWallet = async (customer_id) => {
  try {
    let data = {
      TransactionTypeId: 3500,
      BusinessReferenceNumber: "",
      InvoiceNumber: "Inv-01",
      Quantity: 1,
      WalletProgramGroupName: "Ayur Mall WPG",
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
        TransactionId: "123008",
        Authorization: `Bearer ${process.env.Authorization}`,
      },
      data: data,
    };

    let walletCreation = await axios(config);
    console.log(walletCreation);
    if (
      (walletCreation.status == "200", walletCreation.data.ResponseCode == "0")
    ) {
      console.log(walletCreation.data.Wallets[0]);
      return walletCreation.data.Wallets[0];
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
export const addToWallet = async (wallet_id, gc_pin) => {
  try {
    let activatedCard = await activateCard(gc_pin);
    if (activatedCard.status == "200" && activatedCard.data.Cards) {
      let data = {
        TransactionTypeId: "3508",
        Cards: [
          {
            CardNumber: wallet_id,
            PaymentInstruments: [
              {
                InstrumentNumber: activatedCard.data.Cards.CardNumber,
                InstrumentPin: gc_pin,
              },
            ],
          },
        ],
        Notes: "Test Add Card to Wallet",
      };

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://qc3.qwikcilver.com/QwikCilver/XnP/api/v3/gc/transactions",
        headers: {
          "Content-Type": "application/json;charset=UTF-8 ",
          DateAtClient: "06/20/2021",
          TransactionId: "1283",
          Authorization: `Bearer ${process.env.Authorization}`,
        },
        data: data,
      };

      let cardAdded = await axios(config);
      // console.log(cardAdded);
      return cardAdded
    }
  } catch (err) {
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
export const activateCard = async (gc_pin) => {
  try {
    console.log(gc_pin);
    let data = {
      TransactionTypeId: 322,
      InputType: "1",
      Cards: [{ CardPin: gc_pin }],
      Notes: "Activate Only",
    };

    let config = {
      method: "post",
      url: "https://qc3.qwikcilver.com/QwikCilver/XNP/api/v3/gc/transactions",
      headers: {
        "Content-Type": "application/json;charset=UTF-8 ",
        DateAtClient: "07/04/2023",
        TransactionId: "012531",
        Authorization: `Bearer ${process.env.Authorization}`,
      },
      data: data,
    };

    let activation = await axios(config);
    return activation;
  } catch (err) {
    console.log(err);
  }
};
