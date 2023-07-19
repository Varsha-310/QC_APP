import React, { useEffect, useState } from "react";
import GiftCardTable from "../../components/DataTable/GiftCardTable";
import Pagination from "../../components/Pagination";
import axios from "axios";
import instance from "../../axios";
import BarLoading from "../../components/Loaders/BarLoading";
import { getUserToken } from "../../utils/userAuthenticate";

const GiftCardsList = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  console.log(data);

  // fetch card data
  const updateData = async () => {
    setIsLoading(true);
    const url = `/giftcard/products/list?limit=10&page=${currentPage}`;
    const headers = {
      Authorization: getUserToken(),
      // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZV91cmwiOiJxd2lrY2lsdmVyLXB1YmxpYy1hcHAtdGVzdHN0b3JlLm15c2hvcGlmeS5jb20iLCJpYXQiOjE2ODk1Nzk0MzF9.Vn2dWrXhnvViNC5uD_RWFdbqj84rh9CNnfHI23kd8qE",
    };

    try {
      const res = await instance.post(url, {}, { headers });

      const resData = await res.data;
      setData(resData);
    } catch (error) {
      console.log(error);
    }
    // console.log(res);

    // console.log(resData.data);

    setIsLoading(false);
  };

  // delete card
  const deleteItem = async (id) => {
    console.log(id);
    const url = "/giftcard/products/delete";
    const body = {
      product_id: id.toString(),
    };
    const headers = {
      Authorization: getUserToken(),
    };

    const res = await instance.post(url, body, { headers });
    console.log(res);

    updateData();
  };

  useEffect(() => {
    updateData();

    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div style={{ width: "100%" }}>
      {isLoading ? (
        <BarLoading />
      ) : (
        <>
          <div className="section-box-container">
            <div className="section-box-title">My Gift Cards</div>
          </div>
          <GiftCardTable data={data.data} deleteItem={deleteItem} />
          <Pagination
            total={data.count}
            perPage={10}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </>
      )}
    </div>
  );
};

export default GiftCardsList;
