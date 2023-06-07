import React from "react";
import "./styles/RefundSetting.css";
import { CustomContainer, PrimaryBtn } from "../../components/BasicComponents";

const RefundSetting = () => {
  
  return (
    <div className="refund-setting__component component">
      <div className="section-box-container">
        <div className="section-box-title">Store Credit Configuration</div>
        <div className="section-box-subtitle">
          This settings allows you to credit the refund to a store credit.
        </div>
      </div>

      <div className="section-box-container">
        <div className="refund-setting__title">
          What is the desired action? Select as Applicable
        </div>
      </div>

      <div className="section-box-container">
        <div className="refund-setting__header refund-setting__table-grid">
          <div className="refund-setting__headings">
            Payment Mode of Returned Order
          </div>
          <div className="refund-setting__headings">Refund Back-to-Source</div>
          <div className="refund-setting__headings">Refund to Store-Credit</div>
        </div>

        <div className="refund-setting__options refund-setting__table-grid">
          <div className="refund-setting__type-name">Prepaid</div>
          <input type="radio" className="refund-setting__radio" />
          <input type="radio" className="refund-setting__radio" />
        </div>
        <div className="refund-setting__options refund-setting__table-grid">
          <div className="refund-setting__type-name">COD</div>
          <input type="radio" className="refund-setting__radio" />
          <input type="radio" className="refund-setting__radio" />
        </div>
        <div className="refund-setting__options refund-setting__table-grid">
          <div className="refund-setting__type-name">Gift Card</div>
          <input type="radio" className="refund-setting__radio" />
          <input
            type="radio"
            className="refund-setting__radio" id="default"
          />
        </div>
        <div className="refund-setting__options refund-setting__table-grid">
          <div className="refund-setting__type-name">
            Combination of Prepaid & Gift Card
          </div>
          <input type="radio" className="refund-setting__radio" />
          <input type="radio" className="refund-setting__radio" />
        </div>

        <CustomContainer margin="50px 0px">
          <PrimaryBtn $primary>Save</PrimaryBtn>
        </CustomContainer>
      </div>
    </div>
  );
};

export default RefundSetting;
