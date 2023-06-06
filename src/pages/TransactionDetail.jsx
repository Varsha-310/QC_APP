import React from "react";
import {
  CustomContainer,
  SectionHeading1,
} from "../components/BasicComponents";
import "./style/TransactionDetail.css";
import styled from "styled-components";

import GiftCouponIcon from "../assets/images/GiftCouponIcon.png";

const TextBoxContainer = styled.div`
  display: grid;
  grid-template-columns: 5fr 1fr;
  column-gap: 15px;
  margin: 10px 0px;
`;
const TextBox = styled.div`
  background: #ffffff;
  width: 100%;
  padding: 0px 12px;
  border: 2px solid rgba(0, 0, 0, 0.2);
`;
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
        <SectionHeading1
          weight="500"
          size="16px"
          align="left"
          lineheight="16px"
        >
          Plan Name - Basic
        </SectionHeading1>
      </div>

      <div className="transaction-detail__plan-data">
        <div className="transaction-detail__plan-detail transaction-detail__box-bg">
          <TextElement>Invoice Number: QC01214784</TextElement>
          <TextElement>Issued Date: 11 Feb 2023</TextElement>
          <TextElement>Due Date: 23 Aug 2023</TextElement>
        </div>
        <div className="transaction-detail__plan-due-amount transaction-detail__box-bg">
          <TextElement>Amount Due(INR)</TextElement>

          <CustomContainer align="space-between">
            <TextElement>₹399.00</TextElement>
            <TextElement $fade>(GST no Incl)</TextElement>
          </CustomContainer>

          <div className="transaction-detail__plan-due-date">
            Due On Mar 19, 2024
          </div>
        </div>
      </div>

      <div className="transaction-detail__plan-charges transaction-detail__box-bg">
        <TextBoxContainer>
          <TextBox>
            <TextElement>
              Monthly Digital Issuance as part of plan (Both Gift Cards & Store
              Credits)
            </TextElement>
          </TextBox>
          <TextBox>
            <TextElement align="center">₹20000.00</TextElement>
          </TextBox>
        </TextBoxContainer>

        <TextBoxContainer>
          <TextBox>
            <TextElement>Current Usage</TextElement>
          </TextBox>
          <TextBox>
            <TextElement align="center">₹8000.00</TextElement>
          </TextBox>
        </TextBoxContainer>

        <TextBoxContainer>
          <TextBox>
            <TextElement>
              Issuance above Plan Limits (at 2% of value of issuance)
            </TextElement>
          </TextBox>
          <TextBox>
            <TextElement align="center">Nill</TextElement>
          </TextBox>
        </TextBoxContainer>
      </div>

      <div className="transaction-detail__plan-fees transaction-detail__box-bg">
        <TextBoxContainer>
          <TextBox>
            <TextElement>Subscription Fee</TextElement>
          </TextBox>
          <TextBox>
            <TextElement align="center">₹8000.00</TextElement>
          </TextBox>
        </TextBoxContainer>

        <TextBoxContainer>
          <TextBox>
            <TextElement>Usage Fee (at 2% extra)</TextElement>
          </TextBox>
          <TextBox>
            <TextElement align="center">₹8000.00</TextElement>
          </TextBox>
        </TextBoxContainer>

        <TextBoxContainer>
          <TextElement align="right">Total</TextElement>

          <TextBox>
            <TextElement align="center">₹399.00</TextElement>
          </TextBox>
        </TextBoxContainer>
      </div>

      <img src={GiftCouponIcon} alt="" className="transaction-detail__footer-img"/>
    </div>
  );
};

export default TransactionDetail;
