import React from "react";
import "./style/PlanSelection.css";
import Tick from "../assets/icons/svgs/tick.svg";
import {
  PrimaryBtn,
  SectionHeading1,
  SectionPara,
  SectionTitle,
} from "../components/Components";

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

  return (
    <div className="plan-selection-container container_padding">
      <div className="section-box-container">
        <SectionHeading1
          weight="600"
          size="20px"
          align="left"
          lineheight="20px"
        >
          Register for the gift card scheme
        </SectionHeading1>
        <SectionPara margin={"20px 0px"}>
          To complete registration, provide the necessary details, choose your
          gift card plan, and make the payment.In each section, provide the
          details and click Continue.
        </SectionPara>
        <SectionTitle size="14px" weight="600" lineheight="24px" align="left">
          <span style={{ color: "red" }}>*</span>Marked as Mandatory
        </SectionTitle>
      </div>
      <div className="section-box-container"></div>

      <PrimaryBtn $primary>Confirm Payment</PrimaryBtn>

      <SectionHeading1
        size="20px"
        weight="500"
        lineheight="20px"
        align="center"
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
                <td>{rowData.basic ? <img src={Tick} alt="" /> : <span className="dash"></span>}</td>
                <td>{rowData.pro ? <img src={Tick} alt="" /> : <span className="dash"></span>}</td>
                <td>{rowData.premium ? <img src={Tick} alt="" /> : <span className="dash"></span>}</td>
                <td>{rowData.enterprise ? <img src={Tick} alt="" /> : <span className="dash"></span>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PlanSelection;
