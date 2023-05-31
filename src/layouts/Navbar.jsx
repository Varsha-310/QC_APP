import React from "react";
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
          <li className="navbar-menu-item"></li>
          <li className="navbar-menu-item"></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
