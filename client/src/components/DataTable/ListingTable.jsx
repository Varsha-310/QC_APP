import React from "react";
import "./styles/ListingTable.css";
import DownloadIcon from "../../assets/icons/svgs/downloadIcon.svg";
import { Link } from "react-router-dom";

const ListingTable = ({ headings, data }) => {
  return (
    <table className="listing-table trasaction-table">
      <thead>
        <tr>
          {headings.map((item, index) => (
            <th key={index}>{item}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row?.monthly_plan}</td>
            <td>{row?.invoice_bill_date.slice(0, 10)}</td>
            <td>#{row?.invoice_number}</td>
            <td>INR {row?.total_amount}</td>
            <td>{row?.next_payment_date.slice(0,10)}</td>
            <td id="action">
              <a href={row?.invoice_pdf_url} target="_blank" rel="noreferrer">
                <img src={DownloadIcon} alt="" />
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListingTable;

// {keys.map((key) => (
//   <td className={`listing-table__${key}`}>{row?[key]}</td>
// ))}
