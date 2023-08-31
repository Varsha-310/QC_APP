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
import Spinner from "../../components/Loaders/Spinner";
import StarFull from "../../assets/icons/pngs/Star.png";
import StarNull from "../../assets/icons/pngs/StarNull.png";
import Toast from "../../components/Toast";
import useScrollTop from "../../hooks/useScrollTop";
import useUserAuthentication from "../../hooks/useUserAuthentication";

const DashboardHome = () => {
  useUserAuthentication();
  useScrollTop();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [kycData, setKycData] = useState(null);

  console.log(kycData);

  const getKycStatus = async () => {
    const url = "/kyc/status";
    const headers = {
      Authorization: getUserToken(),
    };

    try {
      const res = await instance.post(url, {}, { headers });

      if (res?.status === 200) {
        const resData = res.data;

        if (resData?.code === 401) {
          throw new Error(
            "Authentication Failed: Unable to authenticate. Please log in again."
          );
        }
        if (resData?.code === 403) {
          throw new Error(
            "Session Expired: Your Session has expired. Please log in again."
          );
        }

        // for any other error
        if (resData?.code !== 200) {
          throw new Error("There is some Error in the server.");
        }
        // console.log(resData);
        setKycData(resData.data);
        sessionStorage.setItem("qcUserEmail", resData?.data?.email);
      }
    } catch (error) {
      // console.log(error);
      setIsError(error.message);
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
    getKycStatus();
  }, []);

  useEffect(() => {});
  if (isError) {
    return <Toast>{isError}</Toast>;
  }

  return (
    <div className="dashboard-home-container component">
      {isLoading &&
        createPortal(<Spinner />, document.getElementById("portal"))}
      <div className="section-box-container">
        <div className="section-box-title">Welcome to Your Dashboard</div>
      </div>

      <div className="section-box-container">
        <div className="section-box-title-regular">Registration Progress</div>
        <section className="status-progress-contain">
          <ul className="status-progress-list">
            <li className="status-progress-item">
              <Dot size="18px" fill={"true"} />
              <span className="progress-label">
                Install From Shopify App Store
              </span>
            </li>
            <li className="status-progress-item">
              <Dot size="18px" fill={kycData?.kyc} />
              <span className="progress-label">Submit Company Info</span>
            </li>
            <li className="status-progress-item">
              <Dot size="18px" fill={kycData?.plan} />
              <span className="progress-label">Select Subscription Plan</span>
            </li>
            <li className="status-progress-item">
              <Dot size="18px" fill={kycData?.payment} />
              <span className="progress-label">
                Complete Subscription Payment
              </span>
            </li>
            <li className="status-progress-item">
              <Dot size="18px" fill={kycData?.dashboard_activated} />
              <span className="progress-label">
                Go-Live with Gift Cards & Store Credits
              </span>
            </li>
          </ul>
        </section>
      </div>

      {kycData?.dashboard_activated !== true ? (
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
            Account. To start issuing pre-paid gift cards and store credits from
            your website, complete the registration process.
          </p>

          <div style={{ margin: "30px 0px" }}>
            <PrimaryBtn $primary onClick={handleKYC}>
              Start Registration
            </PrimaryBtn>
          </div>
        </div>
      ) : (
        ""
      )}

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
