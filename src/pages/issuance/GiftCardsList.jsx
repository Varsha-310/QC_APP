import React, { useEffect, useState } from "react";
import GiftCardTable from "../../components/DataTable/GiftCardTable";
import axios from "axios";

const GiftCardsList = () => {
  const [data, setData] = useState([]);

  const updateData = async () => {
    const url =
      "https://3563-106-51-87-194.ngrok-free.app/giftcard/products/list";
    const res = await axios.post(
      url,
      {
        store_url: "mmtteststore8.myshopify.com",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "access-control-allow-origin": "*",
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODY2MzczMjh9.1eJq6OAEobuVXQxMm0Be2K31zC6FctOhwPzPicyqrJE",
        },
      }
    );

    const resData = await res.data;
    console.log(resData.data);
    setData(resData.data);
  };

  useEffect(() => {
    updateData();
  }, []);

  return <GiftCardTable data={data} />;
};

export default GiftCardsList;
