import React, { useCallback, useEffect, useState } from "react";
import ResendGiftCardTable from "../../components/DataTable/ResendGiftCardTable";
import axios from "axios";
import { baseUrl1 } from "../../axios";
import { createPortal } from "react-dom";
import Spinner from "../../components/Loaders/Spinner";
import Pagination from "../../components/Pagination";

const ResendGiftCard = () => {
  const [orders, setOrders] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  // console.log(orders);

  // fetch orders
  const fetchOrders = async () => {
    setIsLoading(true);

    const url = baseUrl1 + `/giftcard/orders?page=${currentPage}&pageSize=10`;
    const headers = {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZV91cmwiOiJtbXR0ZXN0c3RvcmU4Lm15c2hvcGlmeS5jb20iLCJpYXQiOjE2ODc0MjAxMzR9.wR7CCHPBMIbIv9o34E37j2yZSWF1GkKv4qXbROV6vf0",
    };

    try {
      const res = await axios.post(url, {}, { headers });
      const resData = res.data;

      if (resData.code === 200) {
        setOrders(resData);
      }
      console.log(resData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // resend mails
  const resendMail = async (orderId) => {
    setIsLoading(true);
    const url = baseUrl1 + `/giftcard/email?order_id=${orderId}`;
    const headers = {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZV91cmwiOiJtbXR0ZXN0c3RvcmU4Lm15c2hvcGlmeS5jb20iLCJpYXQiOjE2ODc0MjAxMzR9.wR7CCHPBMIbIv9o34E37j2yZSWF1GkKv4qXbROV6vf0",
    };

    try {
      const res = await axios.post(url, {}, { headers });
      const resData = res.data;

      if (resData?.code === 200) {
        alert(resData?.message);
      } else {
        alert(resData?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  return orders ? (
    <div style={{ width: "100%" }}>
      {isLoading &&
        createPortal(<Spinner />, document.getElementById("portal"))}
      <ResendGiftCardTable data={orders.data} resendMail={resendMail} />
      <Pagination
        total={orders.total}
        perPage={10}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  ) : (
    createPortal(<Spinner />, document.getElementById("portal"))
  );
};

export default ResendGiftCard;
