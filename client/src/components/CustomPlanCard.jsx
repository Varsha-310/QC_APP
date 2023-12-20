import React from "react";
import "./styles/PlanCard.css";
import { CustomBtn } from "./BasicComponents";

const CustomPlanCard = ({ plan, active, popular, btnText, setPlan }) => {
  return (
    <div className={`plan-card ${active ? "card-shadow" : ""}`}>
      <div className="plan-card-title">{plan?.plan_name}</div>

      <div className="custom-spacer"></div>

      <div className="bar"></div>

      <div className="plan-card-subtitle">
        We provide more flexible plans for enterprise. Please contact us to get
        the ultimate solution for you.
      </div>

      <div className="bar"></div>
      <div className="custom-spacer"></div>

      {/* btn  */}
      <div className="plan-card-btn">
        <CustomBtn
          active={active}
          onClick={() => window.open("mailto:care@qwikcilver.com", "_blank")}
        >
          {btnText}
        </CustomBtn>
      </div>

      <div className="custom-spacer"></div>
    </div>
  );
};

export default CustomPlanCard;
