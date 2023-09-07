import React, { useEffect, useState } from "react";
import RefundListTable from "../../components/DataTable/RefundListTable";
import Pagination from "../../components/Pagination";
import { getUserToken } from "../../utils/userAuthenticate";
import BarLoading from "../../components/Loaders/BarLoading";
import instance from "../../axios";
import { BiSync } from "react-icons/bi";
import "./styles/RefundList.css";
import { BiSearch } from "react-icons/bi";
import { MdClear } from "react-icons/md";
import { DatePicker, Input } from "antd";

const { RangePicker } = DatePicker;

const RefundList = () => {
  const PER_PAGE_ITEM = 15;

  const [currentPage, setCurrentPage] = useState(1);
  const [refundData, setRefundData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // for search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState(null); // Add this state
  const [filteredOrders, setFilteredOrders] = useState(null);
  console.log(filteredOrders);

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
  //search
  const handleSearch = async () => {
    setIsLoading(true);

    let url = `/order/list?page=1&pageSize=1`;

    if (searchTerm) {
      url += `&orderNo=${searchTerm}`;
    }

    // Append date range to the URL if it exists
    if (selectedDateRange) {
      url += `&startDate=${selectedDateRange[0].format(
        "YYYY-MM-DD"
      )}&endDate=${selectedDateRange[1].format("YYYY-MM-DD")}`;
    }

    const headers = {
      Authorization: getUserToken(),
    };

    try {
      const res = await instance.get(url, { headers });
      const resData = res.data;
      console.log(resData);

      if (resData.code === 200) {
        setFilteredOrders(resData.data);
      }
    } catch (error) {
      if (error.resonpose) {
        console.error("server error", error.resonpose.data);
      } else if (error.request) {
        console.error("no response receieved", error.request);
      } else {
        console.error("Error", error.message);
      }
    } finally {
      setSearchTerm(null);
      setSelectedDateRange(null);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [currentPage]);

  return (
    <div className="refund-list__container">
      <div className="component-primary-heading">Store-Credits & Refunds</div>

      <div className="app-table__list-actions">
        <Input
          type="number"
          name="orderNumber"
          id="orderNumber"
          className="app-table__action-fields"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Order Number"
        />
        <RangePicker
          size="middle"
          className="app-table__action-fields"
          value={selectedDateRange}
          onChange={(dates) => setSelectedDateRange(dates)}
        />

        <BiSearch className="app-table__action-icons" onClick={handleSearch} />

        <MdClear
          className="app-table__action-icons"
          onClick={() => setFilteredOrders(null)}
        />
        <abbr title="Sync Data">
          <BiSync className="app-table__action-icons" onClick={handleSync} />
        </abbr>
        {/* <BiFilter className="app-table__action-icons" onClick={() => {}} /> */}
      </div>

      {isLoading === false ? (
        filteredOrders ? (
          // Display search results
          <>
            {filteredOrders?.totalOrders >= 1 ? (
              <>
                <div className="refund-list__container-table">
                  <RefundListTable
                    headings={Heading}
                    data={filteredOrders?.orders}
                  />
                </div>
                <Pagination
                  total={filteredOrders?.totalOrders}
                  perPage={PER_PAGE_ITEM}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </>
            ) : (
              <div className="section-box-container">
                <div className="section-box-title">No matching results</div>
              </div>
            )}
          </>
        ) : (
          // Display normal list
          <>
            {refundData && refundData?.totalOrders !== 0 ? (
              <>
                <div className="refund-list__container-table">
                  <RefundListTable
                    headings={Heading}
                    data={refundData?.orders}
                  />
                </div>
                <Pagination
                  total={refundData?.totalOrders}
                  perPage={PER_PAGE_ITEM}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </>
            ) : (
              <div className="section-box-container">
                <div className="section-box-title">There are no Gift cards</div>
              </div>
            )}
          </>
        )
      ) : (
        <BarLoading />
      )}
    </div>
  );
};

export default RefundList;
