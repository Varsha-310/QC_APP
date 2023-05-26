import React from "react";
import "./style/DashboardHome.css";
import StarFull from "../assets/icons/pngs/Star.png";
import StarNull from "../assets/icons/pngs/StarNull.png";
import Giftbox from "../assets/images/Giftbox.png";
import { PrimaryBtn, SectionHeading1 } from "../components/Components";

const DashboardHome = () => {
  return (
    <div className="dashboard-home-container">
      <div className="home-section-container">
        <SectionHeading1
          weight="500"
          size="16px"
          align="left"
          lineheight="16px"
        >
          Welcome to Your Dashboard
        </SectionHeading1>
      </div>
      <div className="home-section-container">
        <p className="section-para">Share your thoughts about us with us.</p>
        <div className="rating-stars">
          <img src={StarFull} alt="" />
          <img src={StarFull} alt="" />
          <img src={StarFull} alt="" />
          <img src={StarFull} alt="" />
          <img src={StarNull} alt="" />
        </div>
      </div>
      <div className="home-section-container"></div>
      <div className="home-section-container">
        <SectionHeading1
          weight="500"
          size="24px"
          align="center"
          lineheight="26px"
        >
          Start Your KYC
        </SectionHeading1>
        <p className="section-para">
          Qwikcilver App has been successfully installed on your Shopify
          Account. To start issuing pre-paid gift cards from your website,
          complete the KYC process.
        </p>
      </div>
      <PrimaryBtn $primary>Start KYC</PrimaryBtn>

      <img src={Giftbox} alt="" className="giftbox" />
    </div>
  );
};

export default DashboardHome;
