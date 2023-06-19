import React from "react";
import "./styles/ListingTable.css";
import { Link } from "react-router-dom";
import Resend from "../../assets/icons/svgs/resend.svg";

const ResendGiftCard = ({ data }) => {
  return (
    <table className="listing-table resend-table">
      <thead>
        <tr>
          <th>Order</th>
          <th>Date</th>
          <th>Customer</th>
          <th>Total</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr>
            <td>#{row.order}</td>
            <td>{row.date}</td>
            <td>{row.customer}</td>
            <td>₹ {row.total}</td>
            <td className="gc-table__actions">
              <Link>
                <img className="gc-table-icons" src={Resend} alt="" />
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResendGiftCard;
