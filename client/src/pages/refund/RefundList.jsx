import React, { useEffect, useState } from "react";
import RefundListTable from "../../components/DataTable/RefundListTable";
import Pagination from "../../components/Pagination";
import { getUserToken } from "../../utils/userAuthenticate";
import BarLoading from "../../components/Loaders/BarLoading";
import instance from "../../axios";
import { BiSync } from "react-icons/bi";
import "./styles/RefundList.css";

const RefundList = () => {
  const PER_PAGE_ITEM = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [refundData, setRefundData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const Heading = [
    "Order No.",
    "Order Date",
    "Customer Name",
    "Order Value",
    "Payment Status",
    "Original Payment",
    "Fulfillment Status",
    "Initiate Refund",
    "Refund Mode",
    "Refund Status",
  ];

  // fetching data
  const fetchData = async () => {
    setIsLoading(true);
    const url = "/order/list";
    const params = {
      page: currentPage,
      limit: PER_PAGE_ITEM,
    };
    const headers = {
      Authorization: getUserToken(),
    };

    try {
      const res = await instance.get(url, { params, headers });
      const resData = res.data;
      setRefundData(resData.data);
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  // sync data
  const handleSync = async () => {
    setIsLoading(true);
    const url = "/order/sync";
    const headers = {
      Authorization: getUserToken(),
    };

    try {
      const res = await instance.get(url, { headers });
      alert(res?.data?.message);
      // const resData = res.data;
      // setRefundData(resData.data);

      fetchData();
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  return (
    <div className="refund-list__container">
      {isLoading ? (
        <BarLoading />
      ) : (
        <>
          <div className="section-box-container">
            <div className="section-box-title">Store-Credits & Refunds</div>
          </div>
          <div className="app-table__list-actions">
            <abbr title="Sync Data">
              <BiSync
                className="app-table__action-icons"
                onClick={handleSync}
              />
            </abbr>
          </div>
          <div className="refund-list__container-table">
            <RefundListTable headings={Heading} data={refundData?.orders} />
          </div>
          <Pagination
            total={refundData?.totalOrders}
            perPage={PER_PAGE_ITEM}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default RefundList;
