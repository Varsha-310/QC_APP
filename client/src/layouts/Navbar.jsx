import React from "react";
import SearchIcon from "../assets/icons/svgs/magnifier.svg";
import DownArrow from "../assets/icons/svgs/DownArr.svg";
import UserIcon from "../assets/icons/svgs/user.svg";
import "./styles/Navbar.css";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const handleMenu = () => {
    const menu = document.querySelector(".dashboard__tab-menu");
    console.log(menu);
    menu.classList.toggle("dashboard__menu-active");
  };

  return (
    <div className="navbar-container">
      <GiHamburgerMenu onClick={handleMenu} className="navbar-menu-btn" />
      <div className="navbar-items">
        <img
          src={require("../assets/icons/pngs/qc_logo_transparent1.png")}
          alt="qwikcilver_logo"
          className="navbar-logo_icon"
        />

        <div className="navbar-menu">
          {/* <ul>
            <li className="navbar-menu-item">
              <img src={SearchIcon} alt="" />
            </li>
            <li className="navbar-menu-item">
              <img src={UserIcon} alt="" />
              <img src={DownArrow} alt="" />
            </li>
          </ul> */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
