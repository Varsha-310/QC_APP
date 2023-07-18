import React, { useEffect, useState } from "react";
import ListingTable from "../../components/DataTable/ListingTable";
import axios from "axios";
import instance from "../../axios";

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
    const url =
      instance +
      `/planHistory/checkPlanHistory?page=${currentPage}&limit=${PAGE_LIMIT}`;
    const headers = {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZV91cmwiOiJxd2lja2NpbHZlci1kZXYubXlzaG9waWZ5LmNvbSIsImlhdCI6MTY4Nzg3MDYzMn0.RaURbIwQG9v97h02SrsTEhPmSzlksrpD4WbBavcxXYA",
    };

    try {
      const res = await axios.post(url, {}, { headers });
      setData(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ width: "100%" }}>
      {data && <ListingTable headings={Heading} data={data.data.list} />}
    </div>
  );
};

export default MyInvoices;
