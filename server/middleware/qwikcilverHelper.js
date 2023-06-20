import { respondInternalServerError } from "../helper/response";
import axios from "axios";
import store from "../models/store";

export const createVoucher = async() => {
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
          CardProgramGroupName : setting.qwikcilver_account.CardProgramGroupName,
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
      url: "https://qc3.qwikcilver.com/QwikCilver/XNP/api/v3/gc/transactions",
      headers: {
        "Content-Type": "application/json;charset=UTF-8 ",
        DateAtClient: "06/19/2023",
        TransactionId: transactionId,
        Authorization:
          "Bearer  eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJjdXJyZW50QmF0Y2hOdW1iZXIiOiIxMjIzMDI3NSIsInRlcm1pbmFsSWQiOiJRd2lrUE9TLUNvcnBvcmF0ZS0wMSIsInVzZXJOYW1lIjoiYXl1cm1hbGwuaW50dXNlciIsInBhc3N3b3JkIjoid2pvYTFQTHRZQTdyN0x2aUcrWDNoQklmRDdjYjBySkg5T0piRHV4L2xtdz0iLCJlbmMiOiJ0cnVlIiwiYXV0aFR5cGUiOiJCQVNJQyIsInRva2VuVHlwZSI6InhucF9hdXRoX3Rva2VuIiwibmJmIjoxNjg2ODkyNzkxLCJleHAiOjE2ODc0OTc1OTEsImlhdCI6MTY4Njg5Mjc5MSwiaXNzIjoiaHR0cHM6Ly9xd2lrY2lsdmVyLmNvbS8ifQ.h2jbdubR6kJW0AhPyAR87BJTbS-ffpWuRs_Bz3ga40d_CXca6gBLIYNxC-Q7uqfTZKxerp8B4RM7dKvJnEP-bw",
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
