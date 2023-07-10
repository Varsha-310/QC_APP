import React, { useEffect, useState } from "react";
import ResendGiftCardTable from "../../components/DataTable/ResendGiftCardTable";
import axios from "axios";
import { baseUrl1 } from "../../axios";

const ResendGiftCard = () => {
  const [orders, setOrders] = useState(null);
  console.log(orders);

  // fetch orders
  const fetchOrders = async () => {
    const url = baseUrl1 + "/giftcard/orders";
    const headers = {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZV91cmwiOiJtbXR0ZXN0c3RvcmU4Lm15c2hvcGlmeS5jb20iLCJpYXQiOjE2ODc0MjAxMzR9.wR7CCHPBMIbIv9o34E37j2yZSWF1GkKv4qXbROV6vf0",
    };

    try {
      const res = await axios.post(url, {}, { headers });
      const resData = res.data;

      if (resData.code === 200) {
        setOrders(resData.data);
      }
      console.log(resData);
    } catch (error) {
      console.log(error);
    }
  };

  // resend mails
  const resendMail = async (orderId) => {
    const url = baseUrl1 + `/giftcard/email?order_id=${orderId}`;
    const headers = {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZV91cmwiOiJtbXR0ZXN0c3RvcmU4Lm15c2hvcGlmeS5jb20iLCJpYXQiOjE2ODc0MjAxMzR9.wR7CCHPBMIbIv9o34E37j2yZSWF1GkKv4qXbROV6vf0",
    };

    try {
      const res = await axios.post(url, {}, { headers });
      const resData = res.data;
      console.log(resData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    orders && <ResendGiftCardTable data={orders} resendMail={resendMail} />
  );
};

export default ResendGiftCard;
