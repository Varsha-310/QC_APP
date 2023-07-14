import React, { useEffect, useState } from "react";
import "./styles/DashboardHome.css";
import Spinner from "../../components/Loaders/Spinner";
import StarFull from "../../assets/icons/pngs/Star.png";
import StarNull from "../../assets/icons/pngs/StarNull.png";
import Giftbox from "../../assets/images/Giftbox.png";
import {
  Dot,
  PrimaryBtn,
  SectionHeading1,
  SectionTitle,
} from "../../components/BasicComponents";
import axios from "axios";
import { baseUrl1 } from "../../axios";
import { createPortal } from "react-dom";

const DashboardHome = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [kycData, setKycData] = useState(null);

  const getKycStatus = async () => {
    const url = baseUrl1 + "/kyc/status";
    const headers = {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZV91cmwiOiJxd2lrY2lsdmVyLXB1YmxpYy1hcHAtdGVzdHN0b3JlLm15c2hvcGlmeS5jb20iLCJpYXQiOjE2ODkzMTIxMTh9.kNk4vaidCk2X3MSqHPN4na9-kKiDiAxpSOClF2ckPr0",
    };

    try {
      const res = await axios.post(url, {}, { headers });
      const resData = res.data;

      if (resData.code === 200) {
        setKycData(resData.data);
      }
      console.log(resData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleKYC = async () => {
    setIsLoading(true);
    const url = baseUrl1 + "/kyc/initiate";
    const headers = {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZV91cmwiOiJxd2lrY2lsdmVyLXB1YmxpYy1hcHAtdGVzdHN0b3JlLm15c2hvcGlmeS5jb20iLCJpYXQiOjE2ODkzMTIxMTh9.kNk4vaidCk2X3MSqHPN4na9-kKiDiAxpSOClF2ckPr0",
    };

    try {
      const res = await axios.post(url, {}, { headers });
      const resData = res.data;

      console.log(res);

      window.open(resData.data, "_blank");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
    // console.log(resData);
  };

  useEffect(() => {
    getKycStatus();
  }, []);

  return (
    <div className="dashboard-home-container">
      {isLoading &&
        createPortal(<Spinner />, document.getElementById("portal"))}

      <div className="section-box-container">
        <div className="section-box-title">Welcome to Your Dashboard</div>
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
        <section className="status-progress-contain">
          <ul className="status-progress-list">
            <li className="status-progress-item">
              <Dot size="18px" fill={kycData?.kyc} />
              <span className="progress-label">Company Details</span>
            </li>
            <li className="status-progress-item">
              <Dot size="18px" fill={kycData?.plan} />
              <span className="progress-label">Plan Selection</span>
            </li>
            <li className="status-progress-item">
              <Dot size="18px" fill={kycData?.payment} />
              <span className="progress-label">Payment Status</span>
            </li>
          </ul>
        </section>
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
        <p className="section-para" style={{ marginTop: "30px" }}>
          Qwikcilver App has been successfully installed on your Shopify
          Account. To start issuing pre-paid gift cards from your website,
          complete the KYC process.
        </p>
      </div>

      <PrimaryBtn $primary onClick={handleKYC}>
        Start KYC
      </PrimaryBtn>

      <img src={Giftbox} alt="" className="giftbox" />
    </div>
  );
};

export default DashboardHome;
