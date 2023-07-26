import React from "react";
import "./styles/ListingTable.css";
import { MdOutgoingMail } from "react-icons/md";
// import Resend from "../../assets/icons/svgs/resend.svg";

const ResendGiftCard = ({ data, resendMail }) => {
  return (
    <table className="listing-table resend-table">
      <thead>
        <tr>
          <th>Order</th>
          <th>Date</th>
          <th>Customer</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>#{row?.id}</td>
            <td>{row?.created_at?.slice(0, 10)}</td>
            <td>{row?.customer?.first_name}</td>
            {/* <?td>₹ {row?.total}</?td> */}
            <td className="gc-table__actions">
              <MdOutgoingMail
                className="gc-table-icons"
                style={{ height: "23px", width: "23px" }}
                onClick={() => resendMail(row?.id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResendGiftCard;
