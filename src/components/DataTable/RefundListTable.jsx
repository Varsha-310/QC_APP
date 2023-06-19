import React from "react";
import "./styles/ListingTable.css";
import { Link } from "react-router-dom";

const RefundListTable = ({ headings, data }) => {
  return (
    <table className="listing-table refund-table">
      <thead>
        <tr>
          {headings.map((item) => (
            <th>{item}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr>
            <td>#{row.order}</td>
            <td>{row.date}</td>
            <td>{row.customer}</td>
            <td>₹ {row.total}</td>
            <td>{row.return_status}</td>
            <td>{row.original_payment}</td>
            <td>{row.refund_mode}</td>
            <td>
              <Link
                className={
                  row.initiate_refund !== "NA"
                    ? "refund-success"
                    : "refund-unsuccess"
                }
                to={`/refunds/${row.order}`}
              >
                {row.initiate_refund}
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RefundListTable;
