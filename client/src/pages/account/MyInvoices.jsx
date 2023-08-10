import React, { useEffect, useState } from "react";
import ListingTable from "../../components/DataTable/ListingTable";
import axios from "axios";
import instance from "../../axios";
import { getUserToken } from "../../utils/userAuthenticate";
import BarLoading from "../../components/Loaders/BarLoading";
import LoaderComponent from "../../components/Loaders/LoaderComponent";
import Pagination from "../../components/Pagination";

const MyInvoices = () => {
  const PAGE_LIMIT = 10;

  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
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
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <LoaderComponent />;
  }

  return (
    <div className="component">
      {data?.total > 0 ? (
        <>
          <ListingTable headings={Heading} data={data?.billing} />
          <Pagination
            total={data.total}
            perPage={10}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </>
      ) : (
        <div className="no-element">There is no orders currently.</div>
      )}
    </div>
  );
};

export default MyInvoices;
