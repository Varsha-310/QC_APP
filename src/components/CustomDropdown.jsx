import React, { useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import "./styles/CustomDropdown.css";

const CustomDropdown = ({ options }) => {
  const [isActive, setIsActive] = useState(false);
  const [selected, setIsSelected] = useState("Select");
  function handleBlur(e) {
    console.log(e);
  }
  return (
    <div className="dropdown">
      <div
        onClick={(e) => {
          setIsActive(!isActive);
        }}
        className="dropdown-btn"
      >
        {selected}
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
              setIsSelected(e.target.textContent);
              setIsActive(!isActive);
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomDropdown;
