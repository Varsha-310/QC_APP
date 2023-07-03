import React from "react";
import ResendGiftCardTable from "../../components/DataTable/ResendGiftCardTable";

const ResendGiftCard = () => {
  const data = [
    {
      order: "123",
      date: "12-12-24",
      customer: "Nisha",
      total: "460",
    },
    {
      order: "123",
      date: "12-12-24",
      customer: "Nisha",
      total: "460",
    },
    {
      order: "123",
      date: "12-12-24",
      customer: "Nisha",
      total: "460",
    },
    {
      order: "123",
      date: "12-12-24",
      customer: "Nisha",
      total: "460",
    },
  ];
  
  return <ResendGiftCardTable data={data} />;
};

export default ResendGiftCard;
