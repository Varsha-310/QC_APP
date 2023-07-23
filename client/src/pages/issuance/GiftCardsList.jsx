import React, { useEffect, useState } from "react";
import GiftCardTable from "../../components/DataTable/GiftCardTable";
import Pagination from "../../components/Pagination";
import instance from "../../axios";
import BarLoading from "../../components/Loaders/BarLoading";
import { getUserToken } from "../../utils/userAuthenticate";
// import useAuthenticate from "../../hooks/useAuthenticate";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useScrollTop from "../../hooks/useScrollTop";

const GiftCardsList = () => {
  // const { getUserToken } = useAuthenticate();
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
    };

    try {
      const res = await instance.post(url, {}, { headers });
      const resData = await res.data;
      setData(resData);
    } catch (error) {
      console.log(error);
    }

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

  useScrollTop();
  useEffect(() => {
    updateData();
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
          <GiftCardTable data={data?.data} deleteItem={deleteItem} />
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
