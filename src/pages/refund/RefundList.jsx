import React, { useEffect, useState } from "react";
import RefundListTable from "../../components/DataTable/RefundListTable";
import Pagination from "../../components/Pagination";
import axios from "axios";
import { baseUrl2 } from "../../axios";

const RefundList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [refundData, setRefundData] = useState(null);
  const Heading = [
    "Order",
    "Date",
    "Customer",
    "Total",
    "Return Status",
    "Original Payment",
    "Refund Mode",
    "Initiate Refund",
  ];

  const updateData = async () => {
    const url = `${baseUrl2}/stores/getStoreData?page=${currentPage}&limit=10&store_url=qwickcilver-dev.myshopify.com`;
    const headers = {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZV91cmwiOiJxd2lja2NpbHZlci1kZXYubXlzaG9waWZ5LmNvbSIsImlhdCI6MTY4Nzg3MDYzMn0.RaURbIwQG9v97h02SrsTEhPmSzlksrpD4WbBavcxXYA",
    };

    // let res;
    const res = await axios.post(url, {}, { headers });
    console.log(res);

    const resData = await res.data;
    console.log(resData.data);
    setRefundData(resData.data);
  };

  useEffect(() => {
    updateData();
  }, []);

  return (
    <div className="refund-list__container " style={{ width: "100%" }}>
      <RefundListTable headings={Heading} data={refundData?.orders} />
      <Pagination
        total={refundData?.totalOrders}
        perPage={5}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default RefundList;
