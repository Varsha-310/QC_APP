import React from "react";

const index = ({ headings, rows }) => {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {headings.map((item) => (
            <th>{item}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(row=> <tr>
          {row.map(item=> <td>{item} </td>)}
        </tr>)}
      </tbody>
    </table>
  );
};

export default index;
