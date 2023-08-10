import React from "react";
import "./styles/ListingTable.css";
import DownloadIcon from "../../assets/icons/svgs/downloadIcon.svg";

const ListingTable = ({ headings, data }) => {
  console.log(data);
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
        {data?.map((row) => (
          <tr key={row?.id}>
            <td>{row?.planName}</td>
            <td>{new Date(row?.issue_Date).toDateString().slice(4)}</td>
            <td>#{row?.invoiceNumber}</td>
            <td>₹ {row?.total_amount}</td>
            <td>{new Date(row?.planEndDate).toDateString().slice(4)}</td>
            <td id="action">
              <a href={row?.invoiceUrl} target="_blank" rel="noreferrer">
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
