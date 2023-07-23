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
          <img src={require("../assets/icons/pngs/cardcap.png")} />
          <div className="text">Most Popular</div>
        </div>
      )}

      <div className="plan-card-title">{plan?.plan_name}</div>
      <div className="plan-card-price">
        ₹ {plan?.price}
        <span>/Month</span>
      </div>

      <div className="bar"></div>

      <div className="plan-card-subtitle">Monthly Subscription Limits</div>
      <div className="plan-card-value">
        <img src={RoundedTick} />
        Plan Issuance Value - Rs {plan?.plan_limit}
      </div>

      <div className="bar"></div>

      <div className="plan-card-subtitle-2">
        Monthly Usage Fees (Charge beyond limits)
      </div>
      <div className="plan-card-value">
        <img src={RoundedTick} />
        As of (%) value of Issuance - {plan?.usage_charge}%
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
