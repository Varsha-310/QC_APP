import React from "react";
import "./styles/ListingTable.css";
import { Link } from "react-router-dom";
import Resend from "../../assets/icons/svgs/resend.svg";

const ResendGiftCard = ({ data, resendMail }) => {
  return (
    <table className="listing-table resend-table">
      <thead>
        <tr>
          <th>Order</th>
          <th>Date</th>
          <th>Customer</th>
          {/* <th>Total</th> */}
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr>
            <td>#{row?.id}</td>
            <td>{row?.created_at?.slice(0, 10)}</td>
            <td>{row?.customer?.first_name}</td>
            {/* <?td>₹ {row?.total}</?td> */}
            <td className="gc-table__actions">
              <span onClick={() => resendMail(row?.id)}>
                <img className="gc-table-icons" src={Resend} alt="" />
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResendGiftCard;
