import React, { useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import "./styles/CustomDropdown.css";

const CustomDropdown = ({ options, keyField, value, setvalue, emptyText }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="dropdown">
      <div
        onClick={(e) => {
          setIsActive(!isActive);
        }}
        className="dropdown-btn"
      >
        {/* {validity ? (validity === "180" ? "6 months" : "12 months") : "Select"} */}
        {options.find((item) => item.value === value)?.title ||
          emptyText ||
          "Select"}
        <span>{isActive ? <FaCaretUp /> : <FaCaretDown />}</span>
      </div>
      <div
        className="dropdown-content"
        style={{ display: isActive ? "block" : "none" }}
      >
        {options?.map((item, index) => (
          <div
            key={index}
            className="item"
            onClick={(e) => {
              setvalue((prev) => ({ ...prev, [keyField]: item.value }));
              setIsActive(!isActive);
            }}
          >
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomDropdown;
