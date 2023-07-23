import React from "react";
import "./styles/GiftCardTable.css";
import { Link } from "react-router-dom";
import GiftcardImage from "../../assets/images/dummyGiftcardImage.png";
import EditIcon from "../../assets/icons/svgs/Edit.svg";
import DeleteIcon from "../../assets/icons/svgs/deletefill.svg";
import DetailIcon from "../../assets/icons/svgs/Msg.svg";
import { AiFillEye, AiFillDelete, AiFillEdit } from "react-icons/ai";

const GiftCardTable = ({ data, deleteItem }) => {
  return (
    <table className="gift-cards-table">
      <thead>
        <tr>
          <th>Gift Card</th>
          <th>Image</th>
          <th>Created Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((row, index) => (
          <tr key={index}>
            <td>{row.title}</td>
            <td className="gc-table__image">
              <img src={row?.images[0]?.src} alt="" />
            </td>
            <td>{row.created_at?.slice(0, 10)}</td>
            <td className="gc-table__actions">
              <Link to={"/my-gift-card/" + row.id}>
                <AiFillEye className="gc-table-icons" />
              </Link>
              <Link to={"/edit-gift-card/" + row.id}>
                <AiFillEdit className="gc-table-icons" />
              </Link>
              <Link>
                <AiFillDelete
                  className="gc-table-icons"
                  onClick={() => deleteItem(row.id)}
                />
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GiftCardTable;
