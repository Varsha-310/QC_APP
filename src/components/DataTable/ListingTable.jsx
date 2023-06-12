import React from "react";
import "./styles/ListingTable.css";
import { Link } from "react-router-dom";

const ListingTable = ({table, headings, data }) => {
  return (
    <table className="listing-table trasaction-table">
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
            <td>{row.plan_name}</td>
            <td>{row.invoice_date}</td>
            <td>{row.invoice_number}</td>
            <td>INR {row.amount}</td>
            <td>{row.next_payment_date}</td>
            <td id="action">
              <Link to={"/transactions/" + row.action}>Details</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListingTable;

// {keys.map((key) => (
//   <td className={`listing-table__${key}`}>{row[key]}</td>
// ))}
