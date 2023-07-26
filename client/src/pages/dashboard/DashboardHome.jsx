import React, { useEffect, useState } from "react";
import "./styles/DashboardHome.css";
import {
  Dot,
  PrimaryBtn,
  SectionHeading1,
} from "../../components/BasicComponents";

import instance from "../../axios";
import { createPortal } from "react-dom";
import { getUserToken, setUserToken } from "../../utils/userAuthenticate";
// import useAuntenticate from "../../hooks/useAuthenticate";
import Spinner from "../../components/Loaders/Spinner";
import StarFull from "../../assets/icons/pngs/Star.png";
import StarNull from "../../assets/icons/pngs/StarNull.png";

const DashboardHome = () => {
  // const { getUserToken, setUserToken } = useAuntenticate();

  const [isLoading, setIsLoading] = useState(false);
  const [kycData, setKycData] = useState(null);

  const getKycStatus = async () => {
    const url = "/kyc/status";
    const headers = {
      Authorization: getUserToken(),
    };

    try {
      const res = await instance.post(url, {}, { headers });

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
    const url = "/kyc/initiate";
    const headers = {
      Authorization: getUserToken(),
    };

    try {
      const res = await instance.post(url, {}, { headers });
      const resData = res.data;

      console.log(res);

      window.open(resData.data, "_blank");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      setUserToken(token);

      localStorage.setItem("qcUserStatus", true);
    }

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
        <div className="section-box-title-regular">Registration Progess</div>
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
          Start Your Registration
        </SectionHeading1>
        <p className="section-para" style={{ marginTop: "30px" }}>
          Qwikcilver App has been successfully installed on your Shopify
          Account. To start issuing pre-paid gift cards and store credits from your website,
          complete the KYC process.
        </p>

        <div style={{ margin: "30px 0px" }}>
          <PrimaryBtn $primary onClick={handleKYC}>
            Start Registration
          </PrimaryBtn>
        </div>
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

      {/* <img src={Giftbox} alt="" className="giftbox" />   */}
    </div>
  );
};

export default DashboardHome;
