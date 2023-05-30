import React from "react";
import "./style/DashboardHome.css";
import StarFull from "../assets/icons/pngs/Star.png";
import StarNull from "../assets/icons/pngs/StarNull.png";
import Giftbox from "../assets/images/Giftbox.png";
import { Dot, PrimaryBtn, SectionHeading1, SectionTitle } from "../components/Components";

const DashboardHome = () => {
  return (
    <div className="dashboard-home-container">
      <div className="section-box-container">
        <SectionHeading1
          weight="500"
          size="16px"
          align="left"
          lineheight="16px"
        >
          Welcome to Your Dashboard
        </SectionHeading1>
      </div>

      <div className="section-box-container">
        <p className="section-para">Share your thoughts about us with us.</p>
        <div className="rating-stars">
          <img src={StarFull} alt="" />
          <img src={StarFull} alt="" />
          <img src={StarFull} alt="" />
          <img src={StarFull} alt="" />
          <img src={StarNull} alt="" />
        </div>
      </div>

      <div className="section-box-container">
        <div className="status-dot-container">
          <Dot size="18px" fill={true} />
          <Dot size="18px" fill={false} />
          <Dot size="18px" fill={false} />
        </div>
        <div className="status-dot-container">
          <SectionTitle size="12px" weight="600" lineheight="150%" align="center">Company Detail</SectionTitle>
          <SectionTitle size="12px" weight="400" lineheight="150%" align="center">Plan Selection</SectionTitle>
          <SectionTitle size="12px" weight="400" lineheight="150%" align="center">Payment Status</SectionTitle>
        </div>
      </div>

      <div className="section-box-container">
        <SectionHeading1
          weight="500"
          size="24px"
          align="center"
          lineheight="26px"
        >
          Start Your KYC
        </SectionHeading1>
        <p className="section-para" style={{marginTop: "30px"}}>
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
