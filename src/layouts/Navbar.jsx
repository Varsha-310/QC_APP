import React from "react";
import SearchIcon from "../assets/icons/svgs/magnifier.svg"
import DownArrow from "../assets/icons/svgs/DownArr.svg"
import UserIcon from "../assets/icons/svgs/user.svg"
import "./styles/Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar-container">
      <img
        src={require("../assets/icons/pngs/qc_logo_transparent.png")}
        alt="qwikcilver_logo"
        className="navbar-logo_icon"
      />
      
      <div className="navbar-menu">
        <ul>
          <li className="navbar-menu-item"><img src={SearchIcon} alt=""/></li>
          <li className="navbar-menu-item"><img src={UserIcon} alt=""/><img src={DownArrow} alt=""/></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
