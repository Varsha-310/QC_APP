import React, { useEffect, useState } from "react";
import GiftCardTable from "../../components/DataTable/GiftCardTable";
import Pagination from "../../components/Pagination";
import axios from "axios";

const GiftCardsList = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const updateData = async () => {
    const url = `https://b170-49-207-198-131.ngrok-free.app/giftcard/products/list?limit=5&page=${currentPage}`;
    const headers = {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZV91cmwiOiJtbXR0ZXN0c3RvcmU4Lm15c2hvcGlmeS5jb20iLCJpYXQiOjE2ODc0MjAxMzR9.wR7CCHPBMIbIv9o34E37j2yZSWF1GkKv4qXbROV6vf0",
    };
    // let res;
    const res = await axios.post(url, {}, { headers });
    console.log(res);

    const resData = await res.data;
    console.log(resData.data);
    setData(resData.data);
  };

  useEffect(() => {
    updateData();
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <GiftCardTable data={data} />
      <Pagination total={11} perPage={5} setPage={setCurrentPage}/>
    </div>
  );
};

export default GiftCardsList;
