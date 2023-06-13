import React from "react";
import "./styles/GiftCardTable.css";
import { Link } from "react-router-dom";
import EditIcon from "../../assets/icons/svgs/Edit.svg";
import DeleteIcon from "../../assets/icons/svgs/deletefill.svg";
import DetailIcon from "../../assets/icons/svgs/Msg.svg";

const GiftCardTable = ({ data }) => {
  return (
    <div className="gift-cards-table">
      <thead>
        <tr>
          <th>Gift Card</th>
          <th>Image</th>
          <th>Date</th>
          <th>Gift card launch date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr>
            <td>{row.gift_card}</td>
            <td className="gc-table__image">
              <img src={row.image} alt="" />
            </td>
            <td>{row.date}</td>
            <td>{row.gift_card_launch_date}</td>
            <td className="gc-table__actions">
                <Link><img className="gc-table-icons" src={DetailIcon} alt=""/></Link>
                <Link><img className="gc-table-icons" src={EditIcon} alt=""/></Link>
                <Link><img className="gc-table-icons" src={DeleteIcon} alt=""/></Link>
            </td>
          </tr>
        ))}
      </tbody>
    </div>
  );
};

export default GiftCardTable;
