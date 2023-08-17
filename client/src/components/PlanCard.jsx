import React from "react";
import "./styles/PlanCard.css";
import RoundedTick from "../assets/icons/svgs/cicletick.svg";
import { CustomBtn } from "./BasicComponents";

const PlanCard = ({ plan, active, popular, btnText, setPlan }) => {
  return (
    <div className={`plan-card ${active ? "card-shadow" : ""}`}>
      {/* popular plan */}
      {plan?.plan_name.toLowerCase() === "pro" && (
        <div className="popular-banner">
          <img src={require("../assets/icons/pngs/cardcap.png")} alt="" />
          <div className="text">Most Popular</div>
        </div>
      )}

      <div className="plan-card-title">{plan?.plan_name}</div>
      <div className="plan-card-price">
        ₹ {plan?.price}
        <span>/Month</span>
        <div className="plan-card-gst">+GST</div>
      </div>

      <div className="bar"></div>

      <div className="plan-card-subtitle">
        Create store credits & gift cards
      </div>
      <div className="plan-card-value">
        {/* <img src={RoundedTick} alt="" /> */}
        up to Rs {plan?.plan_limit}
      </div>

      <div className="bar"></div>

      <div className="plan-card-subtitle">
        {/* Monthly Usage Fees (Charge beyond limits) */}
        Usage fee for issuance above limit
      </div>
      <div className="plan-card-value">
        {/* <img src={RoundedTick} alt="" /> */}
        {plan?.usage_charge}% of value of issuance
        {/* As of (%) value of Issuance - {plan?.usage_charge}% */}
      </div>

      {/* btn  */}
      {btnText !== "" ? (
        <div className="plan-card-btn">
          <CustomBtn active={active} onClick={() => setPlan(plan)}>
            {btnText}
          </CustomBtn>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default PlanCard;
