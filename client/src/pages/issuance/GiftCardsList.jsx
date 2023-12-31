import React, { useCallback, useEffect, useState } from "react";
import GiftCardTable from "../../components/DataTable/GiftCardTable";
import Pagination from "../../components/Pagination";
import instance from "../../axios";
import BarLoading from "../../components/Loaders/BarLoading";
import { getUserToken } from "../../utils/userAuthenticate";
// import useAuthenticate from "../../hooks/useAuthenticate";
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
    console.log("useeffect");
  }, [currentPage]);

  return (
    <div className="component">
      {isLoading ? (
        <BarLoading />
      ) : (
        <>
          <div className="component-primary-heading">Gift Card SKU's</div>

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
