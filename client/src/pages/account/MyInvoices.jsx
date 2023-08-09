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
