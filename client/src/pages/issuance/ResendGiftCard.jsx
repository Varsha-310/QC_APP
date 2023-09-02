import React, { useEffect, useState } from "react";
import ResendGiftCardTable from "../../components/DataTable/ResendGiftCardTable";
import axios from "axios";
import instance from "../../axios";
import { createPortal } from "react-dom";
import Spinner from "../../components/Loaders/Spinner";
import Pagination from "../../components/Pagination";
import { getUserToken } from "../../utils/userAuthenticate";
import BarLoading from "../../components/Loaders/BarLoading";

const ResendGiftCard = () => {
  const [orders, setOrders] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  // console.log(orders);

  // fetch orders
  const fetchOrders = async () => {
    setIsLoading(true);

    const url = `/giftcard/orders?page=${currentPage}&pageSize=10`;
    const headers = {
      Authorization: getUserToken(),
    };

    try {
      const res = await instance.post(url, {}, { headers });
      const resData = res.data;

      if (resData.code === 200) {
        setOrders(resData);
      }
      console.log(resData);
    } catch (error) {
      if (error.resonpose) {
        console.error("server error", error.resonpose.data);
      } else if (error.request) {
        console.error("no response receieved", error.request);
      } else {
        console.error("Error", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // resend mails
  const resendMail = async (orderId) => {
    setIsLoading(true);
    const url = `/giftcard/email?order_id=${orderId}`;
    const headers = {
      Authorization: getUserToken(),
    };

    try {
      const res = await instance.post(url, {}, { headers });
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

  if (isLoading) {
    return (
      <div className="component">
        <BarLoading />
      </div>
    );
  }

  return (
    <div className="component">
      <div className="section-box-container">
        <div className="section-box-title">Gift Card Orders</div>
      </div>

      {!!orders && orders?.total !== 0 ? (
        <>
          <ResendGiftCardTable data={orders?.data} resendMail={resendMail} />

          <Pagination
            total={orders?.total}
            perPage={10}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </>
      ) : (
        <div className="section-box-container">
          <div className="section-box-title"> There is 0 Gift cards</div>
        </div>
      )}
    </div>
  );
};

export default ResendGiftCard;
