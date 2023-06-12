import React from "react";
import ListingTable from "../../components/DataTable/ListingTable";

const TransactionHistory = () => {
  const Heading = [
    "Plan Name",
    "Invoice Date",
    "Invoice Number",
    "Amount",
    "Next Payment Date",
    "Action",
  ];
  const data = [
    {
      plan_name: "Pro",
      invoice_date: "12-12-23",
      invoice_number: "#123",
      amount: "444",
      next_payment_date: "23-01-24",
      action: "11",
    },
    {
      plan_name: "Pro",
      invoice_date: "12-12-23",
      invoice_number: "#123",
      amount: "444",
      next_payment_date: "23-01-24",
      action: "11",
    },
    {
      plan_name: "Pro",
      invoice_date: "12-12-23",
      invoice_number: "#123",
      amount: "444",
      next_payment_date: "23-01-24",
      action: "11",
    },
    {
      plan_name: "Pro",
      invoice_date: "12-12-23",
      invoice_number: "#123",
      amount: "444",
      next_payment_date: "23-01-24",
      action: "11",
    },
    {
      plan_name: "Pro",
      invoice_date: "12-12-23",
      invoice_number: "#123",
      amount: "444",
      next_payment_date: "23-01-24",
      action: "11",
    },
    {
      plan_name: "Pro",
      invoice_date: "12-12-23",
      invoice_number: "#123",
      amount: "444",
      next_payment_date: "23-01-24",
      action: "11",
    },
    {
      plan_name: "Pro",
      invoice_date: "12-12-23",
      invoice_number: "#123",
      amount: "444",
      next_payment_date: "23-01-24",
      action: "11",
    },
    {
      plan_name: "Pro",
      invoice_date: "12-12-23",
      invoice_number: "#123",
      amount: "444",
      next_payment_date: "23-01-24",
      action: "11",
    },
  ];
  return (
    <div style={{ width: "100%" }}>
      <ListingTable headings={Heading} data={data}/>
    </div>
  );
};

export default TransactionHistory;
