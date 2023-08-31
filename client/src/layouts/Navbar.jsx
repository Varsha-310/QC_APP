import React, { useEffect, useState } from "react";
import "./styles/Navbar.css";
import DownArrow from "../assets/icons/svgs/DownArr.svg";
import UserIcon from "../assets/icons/svgs/user.svg";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const [popUp, setPopUp] = useState(false);

  const handleMenu = () => {
    const menu = document.querySelector(".dashboard__tab-menu");
    console.log(menu);
    menu.classList.toggle("dashboard__menu-active");
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.replace("https://admin.shopify.com/");
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (popUp && !e.target.closest(".navbar-menu-item")) {
        setPopUp(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.addEventListener("click", handleClick);
    };
  }, [popUp]);

  // useEffect(() => {
  //   if (userEmail !== sessionStorage.getItem("qcUserEmail")) {
  //     setUserEmail(sessionStorage.getItem("qcUserEmail"));
  //   }
  // }, [userEmail]);

  return (
    <div className="navbar-container">
      <GiHamburgerMenu onClick={handleMenu} className="navbar-menu-btn" />
      <div className="navbar-items">
        <img
          src={require("../assets/icons/pngs/qc_logo_transparent.png")}
          alt="qwikcilver_logo"
          className="navbar-logo_icon"
        />

        <div className="navbar-menu">
          <ul>
            <li className="navbar-menu-item">
              {/* <img src={SearchIcon} alt="" /> */}
            </li>
            <li className="navbar-menu-item" onClick={() => setPopUp(!popUp)}>
              <img src={UserIcon} alt="" />
              <span className="nav-bar__user-email">
                {sessionStorage.getItem("qcUserEmail") || ""}
              </span>
              <img src={DownArrow} alt="" />
            </li>
          </ul>
          {popUp ? (
            <span className="nav-bar__logout" onClick={handleLogout}>
              Log Out <FiLogOut />
            </span>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
