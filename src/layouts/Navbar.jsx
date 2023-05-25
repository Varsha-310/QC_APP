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
        <div className="navbar-menu-item"></div>
        <div className="navbar-menu-item"></div>
      </div>
    </div>
  );
};

export default Navbar;
