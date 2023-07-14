import React from "react";
import { CustomContainer } from "../../components/BasicComponents";
import "./styles/TransactionDetail.css";
import styled from "styled-components";

import GiftCouponIcon from "../../assets/images/GiftCouponIcon.png";

const TextElement = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  display: flex;
  align-items: center;
  justify-content: ${({ align }) => align || ""};
  margin: 10px 0px;
  color: ${(props) => (props.$fade ? "#00000099" : "#000000")};
`;

const TransactionDetail = () => {
  return (
    <div className="transaction-detail__container">
      <div className="section-box-container">
        <div className="section-box-title">Current Usage</div>
      </div>

      {/* plan */}
      <div className="transaction-detail__plan-data">
        <div className="transaction-detail__plan-detail transaction-detail__box-bg">
          <TextElement>Invoice Number: QC01214784</TextElement>
          <TextElement>Issued Date: 11 Feb 2023</TextElement>
          <TextElement>Due Date: 23 Aug 2023</TextElement>
        </div>
        <div className="transaction-detail__plan-due-amount transaction-detail__box-bg">
          <TextElement>Amount Due(INR)</TextElement>

          <CustomContainer align="space-between">
            <div className="transaction-detail__due-amount">₹ 399.00</div>
            <TextElement $fade>(GST no Incl)</TextElement>
          </CustomContainer>

          <div className="transaction-detail__plan-due-date">
            Due On Mar 19, 2024
          </div>
        </div>
      </div>

      {/* plan details & usages */}
      <div className="transaction-detail__plan-charges transaction-detail__box-bg">
        <TextElement>Your Current Plan - Basic</TextElement>
        <div className="gift-card__text-box-container">
          <div className="gift-card__text-box">
            <TextElement>
              Monthly Digital Issuance as part of plan (Both Gift Cards & Store
              Credits)
            </TextElement>
          </div>
          <div className="gift-card__text-box">
            <TextElement align="center">₹20000.00</TextElement>
          </div>
        </div>

        <div className="gift-card__text-box-container">
          <div className="gift-card__text-box">
            <TextElement>Current Usage</TextElement>
          </div>
          <div className="gift-card__text-box">
            <TextElement align="center">₹8000.00</TextElement>
          </div>
        </div>

        <div className="gift-card__text-box-container">
          <div className="gift-card__text-box">
            <TextElement>
              Issuance beyond Plan Limits (To be charged at 2.5% of Value of
              Issuance)
            </TextElement>
          </div>
          <div className="gift-card__text-box">
            <TextElement align="center">Nill</TextElement>
          </div>
        </div>
      </div>

      {/* expected charges */}
      <div className="transaction-detail__plan-fees transaction-detail__box-bg">
        <TextElement>Expected Charges - March, 2023</TextElement>
        <div className="gift-card__text-box-container">
          <div className="gift-card__text-box">
            <TextElement>Subscription Fee</TextElement>
          </div>
          <div className="gift-card__text-box">
            <TextElement align="center">₹8000.00</TextElement>
          </div>
        </div>

        <div className="gift-card__text-box-container">
          <div className="gift-card__text-box">
            <TextElement>Usage Fee (at 2.5% of Value Issuance)</TextElement>
          </div>
          <div className="gift-card__text-box">
            <TextElement align="center">₹8000.00</TextElement>
          </div>
        </div>

        <div className="gift-card__text-box-container">
          <TextElement align="right">Total</TextElement>
          <div className="gift-card__text-box">
            <TextElement align="center" id="total">₹1600.00</TextElement>
          </div>
        </div>
      </div>

      <img
        src={GiftCouponIcon}
        alt=""
        className="transaction-detail__footer-img"
      />
    </div>
  );
};

export default TransactionDetail;
