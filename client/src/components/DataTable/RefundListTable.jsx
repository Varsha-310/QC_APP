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
            <td>#{row?.order_number}</td>
            <td>{row?.updated_at?.slice(0, 10)}</td>
            <td>{row?.customer?.first_name}</td>
            <td>₹ {row?.total_price}</td>
            <td>{row?.financial_status.split("_").join(" ")}</td>
            <td>{row?.payment_gateway_names[0]}</td>
            <td>{row?.Refund_Mode}</td>
            <td>
              {row?.refund_status?.toLowerCase() !== "refunded" ? (
                <Link className={"refund-success"} to={`/refunds/${row.id}`}>
                  Proceed
                </Link>
              ) : (
                <span className="refund-list__completed">Completed</span>
              )}
              
              {/* {row?.financial_status === "paid" ||
              row?.financial_status === "partially_refunded" ? (
                <Link className={"refund-success"} to={`/refunds/${row.id}`}>
                  Proceed
                </Link>
              ) : row?.financial_status === "refunded" ? (
                <span className="refund-list__completed">Completed</span>
              ) : (
                row?.financial_status
              )} */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RefundListTable;
