import React, { useState } from "react";
import RefundListTable from "../../components/DataTable/RefundListTable";
import Pagination from "../../components/Pagination";

const RefundList = () => {
  const [currentPage,setCurrentPage]=useState(1);
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
  const data = [
    {
      order: "1234",
      date: "12-12-23",
      customer: "Nisha",
      total: 2000,
      return_status: "In Process",
      original_payment: "CC",
      refund_mode: "Store Credit",
      initiate_refund: "Proceed",
    },
    {
      order: "1234",
      date: "12-12-23",
      customer: "Nisha",
      total: 2000,
      return_status: "In Process",
      original_payment: "CC",
      refund_mode: "Store Credit",
      initiate_refund: "Proceed",
    },
    {
      order: "1234",
      date: "12-12-23",
      customer: "Nisha",
      total: 2000,
      return_status: "In Process",
      original_payment: "CC",
      refund_mode: "Store Credit",
      initiate_refund: "Proceed",
    },
    {
      order: "1234",
      date: "12-12-23",
      customer: "Nisha",
      total: 2000,
      return_status: "In Process",
      original_payment: "CC",
      refund_mode: "Store Credit",
      initiate_refund: "Proceed",
    },
    {
      order: "1234",
      date: "12-12-23",
      customer: "Nisha",
      total: 2000,
      return_status: "In Process",
      original_payment: "CC",
      refund_mode: "Store Credit",
      initiate_refund: "Proceed",
    },
    {
      order: "1234",
      date: "12-12-23",
      customer: "Nisha",
      total: 2000,
      return_status: "In Process",
      original_payment: "NBI",
      refund_mode: "Back-to-Source",
      initiate_refund: "Proceed",
    },
    {
      order: "1234",
      date: "12-12-23",
      customer: "Nisha",
      total: 2000,
      return_status: "In Process",
      original_payment: "UPI",
      refund_mode: "Store Credit",
      initiate_refund: "NA",
    },
  ];
  return (
    <div className="refund-list__container " style={{ width: "100%" }}>
      <RefundListTable headings={Heading} data={data} />
      <Pagination total={11} perPage={5} setPage={setCurrentPage}/>
    </div>
  );
};

export default RefundList;
