import React from "react";
import "./styles/GiftCardTable.css";
import { Link } from "react-router-dom";
import GiftcardImage from "../../assets/images/dummyGiftcardImage.png";
import EditIcon from "../../assets/icons/svgs/Edit.svg";
import DeleteIcon from "../../assets/icons/svgs/deletefill.svg";
import DetailIcon from "../../assets/icons/svgs/Msg.svg";

const GiftCardTable = ({ data,deleteItem }) => {
  return (
    <table className="gift-cards-table">
      <thead>
        <tr>
          <th>Gift Card</th>
          <th>Image</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((row,index) => (
          <tr key={index}>
            <td>{row.title}</td>
            <td className="gc-table__image">
              <img src={row?.images[0]?.src} alt="" />
            </td>
            <td>{row.created_at.slice(0,10)}</td>
            <td className="gc-table__actions">
                <Link><img className="gc-table-icons" src={DetailIcon} alt="" /></Link>
                <Link><img className="gc-table-icons" src={EditIcon} alt=""/></Link>
                <Link><img className="gc-table-icons" src={DeleteIcon} alt="" onClick={()=>deleteItem(row.id)}/></Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GiftCardTable;
