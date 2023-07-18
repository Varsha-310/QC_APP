import React, { useEffect, useState } from "react";
import RefundListTable from "../../components/DataTable/RefundListTable";
import Pagination from "../../components/Pagination";
import { getUserToken } from "../../utils/userAuthenticate";
import instance from "../../axios";
import BarLoading from "../../components/Loaders/BarLoading";

const RefundList = () => {
  const PER_PAGE_ITEM = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [refundData, setRefundData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const updateData = async () => {
    setIsLoading(true);
    const url = `/order/list`;
    const headers = {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZV91cmwiOiJxd2lrY2lsdmVyLXB1YmxpYy1hcHAtdGVzdHN0b3JlLm15c2hvcGlmeS5jb20iLCJpYXQiOjE2ODk1Nzk0MzF9.Vn2dWrXhnvViNC5uD_RWFdbqj84rh9CNnfHI23kd8qE",
    };

    // let res;
    try {
      const res = await instance.get(url, {}, { headers });
      const resData = await res.data;

      setRefundData(resData.data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }

    // console.log(resData.data);

    setIsLoading(false);
  };

  useEffect(() => {
    updateData();
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
