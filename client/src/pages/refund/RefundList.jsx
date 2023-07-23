import React, { useEffect, useState } from "react";
import RefundListTable from "../../components/DataTable/RefundListTable";
import Pagination from "../../components/Pagination";
import { getUserToken } from "../../utils/userAuthenticate";
import BarLoading from "../../components/Loaders/BarLoading";
import instance from "../../axios";

const RefundList = () => {
  const PER_PAGE_ITEM = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [refundData, setRefundData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const Heading = [
    "Order",
    "Created Date",
    "Customer",
    "Total",
    "Return Status",
    "Original Payment",
    "Refund Mode",
    "Initiate Refund",
  ];

  const fetchData = async () => {
    setIsLoading(true);
    const url = "/order/list";
    const headers = {
      Authorization: getUserToken(),
    };

    try {
      const res = await instance.get(url, { headers });
      const resData = res.data;
      setRefundData(resData.data);
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
    <div
      className="refund-list__container"
      style={{ width: "100%", overflowY: "auto" }}
    >
      {isLoading ? (
        <BarLoading />
      ) : (
        <>
          <div className="section-box-container">
            <div className="section-box-title">Issue Store Credits</div>
          </div>
          <div className="refund-list__containe-table">
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
