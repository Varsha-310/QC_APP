import React from "react";
import "./styles/ListingTable.css";
import { Link } from "react-router-dom";

const RefundListTable = ({ headings, data }) => {
  return (
    <table className="listing-table refund-table">
      <thead>
        <tr>
          {headings.map((item, index) => (
            <th key={index}>{item}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data?.map((row, index) => (
          <tr key={index}>
            <td>#{row.id}</td>
            <td>{row.updated_at?.slice(0, 10)}</td>
            <td>{row.customer?.first_name}</td>
            <td>₹ {row.total_price}</td>
            <td>{row.status}</td>
            <td>{row.payment_gateway_names[0]}</td>
            <td>{row.Refund_Mode}</td>
            <td>
              <Link
                className={
                  row.Initiate_Refund !== "N/A"
                    ? "refund-success"
                    : "refund-unsuccess"
                }
                to={`/refunds/${row.id}`}
              >
                {row.Initiate_Refund}
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RefundListTable;
