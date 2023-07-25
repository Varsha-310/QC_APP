import React, { useEffect, useState } from "react";
import "./styles/PlanSelection.css";
import Tick from "../../assets/icons/svgs/tick.svg";
import {
  CustomBtn,
  PrimaryBtn,
  RectBtn,
  SectionHeading1,
  SectionPara,
  SectionTitle,
} from "../../components/BasicComponents";
import { Link } from "react-router-dom";
import PlanCard from "../../components/PlanCard";
import axios from "axios";
import instance from "../../axios";
import { getUserToken } from "../../utils/userAuthenticate";

const PlanSelection = () => {
  const tableContent = [
    {
      title: "Provide a prepaid e-card",
      basic: true,
      pro: true,
      premium: true,
      enterprise: true,
    },
    {
      title: "Delivery template and thems for e-gift cards",
      basic: false,
      pro: true,
      premium: true,
      enterprise: true,
    },
    {
      title: "Issue Physical Gift Card (pre-paid)",
      basic: false,
      pro: false,
      premium: false,
      enterprise: true,
    },
    {
      title: "Bulk Issuance Tool",
      basic: false,
      pro: false,
      premium: false,
      enterprise: true,
    },
    {
      title: "Report dashboard for all gift card transactions",
      basic: false,
      pro: true,
      premium: true,
      enterprise: true,
    },
    {
      title: "Scheduled Reports: Daily, Weekly, Monthly",
      basic: true,
      pro: true,
      premium: true,
      enterprise: true,
    },
    {
      title: "Omni channel integration (Store POS, Website, Mobile app)",
      basic: false,
      pro: false,
      premium: false,
      enterprise: true,
    },
    {
      title: "Customised Issuane and Redemption rules",
      basic: false,
      pro: false,
      premium: false,
      enterprise: true,
    },
    {
      title: "Distribution in Corporate & online channels",
      basic: false,
      pro: false,
      premium: true,
      enterprise: true,
    },
    {
      title: "Retail Distribution as per requirements (online to off-line)",
      basic: false,
      pro: false,
      premium: false,
      enterprise: true,
    },
  ];
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState(null);

  // get plans
  const fetchPlan = async () => {
    const url = "/plan/list";
    const headers = {
      Authorization: getUserToken(),
    };

    try {
      const res = await instance.post(url, {}, { headers });
      setPlans(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }

    // console.log(res);
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  return (
    <div className="plan-selection-container container_padding">
      <div className="section-box-container">
        <div className="section-box-title">Qwikcilver App Registration</div>
        <div className="section-box-subtitle">
          To complete registration, provide the necessary details and choose
          your subscription plan.
        </div>

        <SectionTitle size="14px" weight="600" lineheight="24px" align="left">
          <span style={{ color: "red" }}>*</span>Marked as Mandatory
        </SectionTitle>
      </div>

      {/* <div className="plan-selection__plan-type">
        <div className="plan-selection__plan-annually">Annually</div>
        <div className="plan-selection__plan-monthly">Monthly</div>
      </div> */}

      {/* plans */}
      <div className="package-detail">
        <RectBtn
          border=" "
          width="100%"
          height="45px"
          weight="400"
          active={false}
        >
          Describe your detail here
        </RectBtn>
        <RectBtn
          border=" "
          width="100%"
          height="45px"
          weight="400"
          active={true}
        >
          Select a package
        </RectBtn>
      </div>
      <div className="plans">
        {plans?.data?.plans.map((plan, index) => {
          return (
            <PlanCard
              key={index}
              plan={plan}
              popular={plan?.plan_name === "Pro" ? true : false}
              btnText={"Select"}
              active={
                selectedPlan?.plan_name === plan?.plan_name ? true : false
              }
              setPlan={setSelectedPlan}
            />
          );
        })}
      </div>

      <div className="section-box-container">
        <div className="terms-check">
          <input type="checkbox" /> I accept Gift Card Processing
          <Link>Terms & Conditions</Link>
        </div>
      </div>

      <div style={{ margin: "40px 0px" }}>
        <PrimaryBtn $primary>Confirm Payment</PrimaryBtn>
      </div>

      {/* enterprise plan box */}

      <div className="enterprise_plan-box">
        {/* <SectionHeading1 weight="600" size="24px" lineheight="30px">
          Enterprise Plan
        </SectionHeading1> */}
        <div className="plan-box-title">Enterprise Plan</div>
        <p className="box-text">
          We provide more flexible plans for enterprise. Please contact us to
          get the ultimate solution for you.
        </p>
        <a href="mailto:">
          E-mail:<span>sales@qwikcilver.com</span>
        </a>
      </div>

      <SectionHeading1
        size="20px"
        weight="500"
        lineheight="20px"
        align="center"
        margin="35px 0px"
      >
        Compare Gift Card Benefits
      </SectionHeading1>

      {/* plan table */}
      <table className="plan-table">
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>Basic</th>
            <th>Pro</th>
            <th>Premium</th>
            <th>Enterprise</th>
          </tr>
        </thead>
        <tbody>
          {tableContent.map((rowData) => {
            return (
              <tr>
                <td>{rowData.title}</td>
                <td>
                  {rowData.basic ? (
                    <img src={Tick} alt="" />
                  ) : (
                    <span className="dash"></span>
                  )}
                </td>
                <td>
                  {rowData.pro ? (
                    <img src={Tick} alt="" />
                  ) : (
                    <span className="dash"></span>
                  )}
                </td>
                <td>
                  {rowData.premium ? (
                    <img src={Tick} alt="" />
                  ) : (
                    <span className="dash"></span>
                  )}
                </td>
                <td>
                  {rowData.enterprise ? (
                    <img src={Tick} alt="" />
                  ) : (
                    <span className="dash"></span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PlanSelection;
