import React, { useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import "./styles/CustomDropdown.css";

const CustomDropdown = ({ options, setCardData, validity }) => {
  const [isActive, setIsActive] = useState(false);
  const [selected, setIsSelected] = useState("Select");

  return (
    <div className="dropdown">
      <div
        onClick={(e) => {
          setIsActive(!isActive);
        }}
        className="dropdown-btn"
      >
        {validity ? (validity === "180" ? "6 months" : "12 months") : "Select"}
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
              setCardData((prev) => ({ ...prev, validity: item.value }));
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
