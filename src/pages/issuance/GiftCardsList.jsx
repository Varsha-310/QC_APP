import React from "react";
import GiftCardTable from "../../components/DataTable/GiftCardTable";

const GiftCardsList = () => {
  const data = [
    {
      gift_card: "Diwali Gift Card",
      image:
        "https://www.kasandbox.org/programming-images/avatars/leaf-blue.png",
      date: "15-09-2023",
      gift_card_launch_date: "16-09-2023",
    },
    {
      gift_card: "Diwali Gift Card",
      image:
        "https://www.kasandbox.org/programming-images/avatars/leaf-blue.png",
      date: "15-09-2023",
      gift_card_launch_date: "16-09-2023",
    },
    {
      gift_card: "Diwali Gift Card",
      image:
        "https://www.kasandbox.org/programming-images/avatars/leaf-blue.png",
      date: "15-09-2023",
      gift_card_launch_date: "16-09-2023",
    },
    {
      gift_card: "Diwali Gift Card",
      image:
        "https://www.kasandbox.org/programming-images/avatars/leaf-blue.png",
      date: "15-09-2023",
      gift_card_launch_date: "16-09-2023",
    },
    {
      gift_card: "Diwali Gift Card",
      image:
        "https://www.kasandbox.org/programming-images/avatars/leaf-blue.png",
      date: "15-09-2023",
      gift_card_launch_date: "16-09-2023",
    },
  ];
  return (
    <div className="gift-cards-list">
      <GiftCardTable data={data} />
    </div>
  );
};

export default GiftCardsList;
