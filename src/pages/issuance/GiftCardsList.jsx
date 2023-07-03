import React, { useEffect, useState } from "react";
import GiftCardTable from "../../components/DataTable/GiftCardTable";
import Pagination from "../../components/Pagination";
import axios from "axios";
import { baseUrl1 } from "../../axios";

const GiftCardsList = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // fetch card data
  const updateData = async () => {
    const url = `${baseUrl1}/giftcard/products/list?limit=10&page=${currentPage}`;
    const headers = {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZV91cmwiOiJtbXR0ZXN0c3RvcmU4Lm15c2hvcGlmeS5jb20iLCJpYXQiOjE2ODc0MjAxMzR9.wR7CCHPBMIbIv9o34E37j2yZSWF1GkKv4qXbROV6vf0",
    };
    // let res;
    const res = await axios.post(url, {}, { headers });
    console.log(res);

    const resData = await res.data;
    console.log(resData.data);
    setData(resData);
  };

  // delete card
  const deleteItem = async (id) => {
    console.log(id);
    const url = `${baseUrl1}/giftcard/products/delete`;
    const body = {
      product_id: id.toString(),
    };
    const headers = {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZV91cmwiOiJtbXR0ZXN0c3RvcmU4Lm15c2hvcGlmeS5jb20iLCJpYXQiOjE2ODc0MjAxMzR9.wR7CCHPBMIbIv9o34E37j2yZSWF1GkKv4qXbROV6vf0",
    };

    const res = await axios.post(url, body, { headers });
    console.log(res);

    updateData();
  };

  useEffect(() => {
    updateData();
  }, [currentPage]);

  return (
    <div style={{ width: "100%" }}>
      <GiftCardTable data={data.data} deleteItem={deleteItem} />
      <Pagination total={data.count} perPage={5} setCurrentPage={setCurrentPage} currentPage={currentPage} />
    </div>
  );
};

export default GiftCardsList;
