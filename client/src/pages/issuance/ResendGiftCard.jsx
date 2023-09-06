import React, { useEffect, useState } from "react";
import ResendGiftCardTable from "../../components/DataTable/ResendGiftCardTable";
import instance from "../../axios";
import Pagination from "../../components/Pagination";
import { getUserToken } from "../../utils/userAuthenticate";
import BarLoading from "../../components/Loaders/BarLoading";
import { BiSearch, BiFilter } from "react-icons/bi";
import { MdClear } from "react-icons/md";
import { DatePicker, Input } from "antd";

const { RangePicker } = DatePicker;

const ResendGiftCard = () => {
  const PER_PAGE_ITEM = 15;

  const [orders, setOrders] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // for search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState(null); // Add this state
  const [filteredOrders, setFilteredOrders] = useState(null);
  console.log(selectedDateRange);

  // fetch orders
  const fetchOrders = async () => {
    setIsLoading(true);

    const url = `/giftcard/orders?page=${currentPage}&pageSize=${PER_PAGE_ITEM}`;
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

  const handleSearch = async () => {
    setIsLoading(true);

    let url = `/giftcard/orders?page=1&pageSize=1`;

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
      const res = await instance.post(url, {}, { headers });
      const resData = res.data;

      if (resData.code === 200) {
        setFilteredOrders(resData);
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
    fetchOrders();
  }, [currentPage]);

  return (
    <div className="component">
      <div className="section-box-container">
        <div className="section-box-title">Gift Card Orders</div>
      </div>

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

        {/* <BiFilter className="app-table__action-icons" onClick={() => {}} /> */}
      </div>

      {isLoading === false ? (
        filteredOrders ? (
          // Display search results
          <>
            {filteredOrders?.total >= 1 ? (
              <>
                <ResendGiftCardTable
                  data={filteredOrders?.data}
                  resendMail={resendMail}
                />

                <Pagination
                  total={filteredOrders?.total}
                  perPage={PER_PAGE_ITEM}
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
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
            {orders && orders.total !== 0 ? (
              <>
                <ResendGiftCardTable
                  data={orders.data}
                  resendMail={resendMail}
                />

                <Pagination
                  total={orders.total}
                  perPage={10}
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
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

export default ResendGiftCard;
