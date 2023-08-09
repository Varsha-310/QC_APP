import React, { useEffect, useState } from "react";
import ListingTable from "../../components/DataTable/ListingTable";
import axios from "axios";
import instance from "../../axios";
import { getUserToken } from "../../utils/userAuthenticate";

const MyInvoices = () => {
  const PAGE_LIMIT = 10;

  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const Heading = [
    "Plan Name",
    "Invoice Date",
    "Invoice Number",
    "Amount",
    "Next Payment Date",
    "Action",
  ];
  // fetching giftcard orders
  const fetchData = async () => {
    const url = `/billing/list?page=${currentPage}&limit=${PAGE_LIMIT}`;
    const headers = {
      Authorization: getUserToken(),
    };

    try {
      const res = await instance.get(url, { headers });
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const testData = {
    billing: [
      {
        _id: "64d220743ec0257b60885877",
        id: "1975636644069376",
        store_id: "64901677287",
        store_url: "qc-plus-store.myshopify.com",
        given_credit: "20000",
        used_credit: "99546",
        montly_charge: "399",
        monthly_gst: "71.82",
        extra_usage_gst: "357.96",
        usage_charge: "2.5",
        extra_usage_amount: "1988.65",
        total_amount: "2817.43",
        notifiedMerchant: "1",
        remiderDate: "1969-09-22T18:07:40.771Z",
        isReminded: false,
        oracleUserId: "OU124",
        planName: "Basic",
        status: "BILLED",
        planEndDate: "2024-12-05T16:20:30.533Z",
        cappedAmount: "100000",
        invoiceNumber: "4880",
        invoiceAmount: "2817.43",
        invoiceUrl: "https://loremflickr.com/640/480?lock=2869307902001152",
        transaction_id: "34758234959534",
        __v: 0,
        invoiceDate: "Mon Jun 16 1969 19:04:40 GMT+0530 (India Standard Time)",
        issue_Date: "1969-03-22T14:31:21.564+00:00",
      },
      {
        _id: "64d2207eee95b9fb4c28ccca",
        id: "7709652127055872",
        store_id: "64901677287",
        store_url: "qc-plus-store.myshopify.com",
        given_credit: "20000",
        used_credit: "67304",
        montly_charge: "399",
        monthly_gst: "71.82",
        extra_usage_gst: "212.87",
        usage_charge: "2.5",
        extra_usage_amount: "1182.60",
        total_amount: "1866.29",
        notifiedMerchant: "1",
        remiderDate: "1969-08-19T09:22:17.616Z",
        isReminded: false,
        oracleUserId: "OU124",
        planName: "Basic",
        status: "BILLED",
        planEndDate: "2027-10-13T09:24:57.528Z",
        cappedAmount: "100000",
        invoiceNumber: "5358",
        invoiceAmount: "1866.29",
        invoiceUrl: "https://loremflickr.com/640/480?lock=3053626075381760",
        transaction_id: "ckweyriuweruoiwer",
        __v: 0,
        invoiceDate: "Mon Mar 17 1969 16:41:11 GMT+0530 (India Standard Time)",
        issue_Date: "1969-03-22T14:31:21.564+00:00",
      },
    ],
    total: 2,
  };

  return (
    <div style={{ width: "100%" }}>
      {data?.total > 0 ? (
        <ListingTable headings={Heading} data={data?.billing} />
      ) : (
        <div className="no-element">There is no orders currently.</div>
      )}
    </div>
  );
};

export default MyInvoices;
