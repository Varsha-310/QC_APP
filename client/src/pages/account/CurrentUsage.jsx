import React, { useEffect, useState } from "react";
import { CustomContainer } from "../../components/BasicComponents";
import "./styles/CurrentUsage.css";
import styled from "styled-components";

import GiftCouponIcon from "../../assets/images/GiftCouponIcon.png";
import { getUserToken } from "../../utils/userAuthenticate";
import instance from "../../axios";

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

const CurrentUsages = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  console.log(data);

  // fetch card data
  const updateData = async () => {
    setIsLoading(true);
    const url = "billing/current/uses";
    const headers = {
      Authorization: getUserToken(),
    };

    try {
      const res = await instance.get(url, { headers });
      const resData = await res.data;
      setData(resData.data);

      console.log("resdata", resData);
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    updateData();
  }, []);

  return (
    <div className="transaction-detail__container">
      <div className="section-box-container">
        <div className="section-box-title">Current Usage</div>
      </div>

      {data?.length > 0 ? (
        data?.reverse().map((uses, index) => {
          return (
            <div key={uses?.id}>
              <div className="section-box-container">
                {/* <div className="transaction-detail__detail-heading"> */}
                {index === 0 ? "Current Plan" : "Previous Plan"}
                {/* </div> */}
              </div>

              {/* plan */}
              <div className="transaction-detail__plan-data">
                <div className="transaction-detail__plan-detail transaction-detail__box-bg">
                  <TextElement>
                    Invoice Number : {uses?.invoiceNumber || "NA"}
                  </TextElement>
                  <TextElement>
                    Issued Date :{" "}
                    {uses?.issue_date
                      ? new Date(uses?.issue_date).toDateString().slice(4)
                      : "NA"}
                  </TextElement>
                  <TextElement>
                    Plan End Date :{" "}
                    {uses?.planEndDate
                      ? new Date(uses?.planEndDate).toDateString().slice(4)
                      : "NA"}
                  </TextElement>
                </div>
                <div className="transaction-detail__plan-due-amount transaction-detail__box-bg">
                  <TextElement>Amount Due(INR)</TextElement>

                  <CustomContainer align="space-between">
                    <div className="transaction-detail__due-amount">
                      ₹ {parseFloat(uses.montly_charge).toFixed(2)}
                    </div>
                    <TextElement $fade>(GST no Incl)</TextElement>
                  </CustomContainer>

                  <div className="transaction-detail__plan-due-date">
                    Due On{" "}
                    {new Date(uses?.billingDate).toDateString().slice(4, 10)}
                  </div>
                </div>
              </div>

              {/* plan details & usages */}
              <div className="transaction-detail__plan-charges transaction-detail__box-bg">
                <div className="transaction-detail__detail-heading">
                  Your Current Plan - {uses?.planName}
                </div>
                <div className="gift-card__text-box-container">
                  <div className="gift-card__text-box">
                    <TextElement>
                      Monthly Digital Issuance as part of plan (Both Gift Cards
                      & Store Credits)
                    </TextElement>
                  </div>
                  <div className="gift-card__text-box">
                    <TextElement align="left">
                      {parseFloat(uses?.given_credit)?.toFixed(2) || "Nill"}
                    </TextElement>
                  </div>
                </div>

                <div className="gift-card__text-box-container">
                  <div className="gift-card__text-box">
                    <TextElement>Current Usage</TextElement>
                  </div>
                  <div className="gift-card__text-box">
                    <TextElement align="left">
                      {parseFloat(uses?.used_credit)?.toFixed(2) || "Nill"}
                    </TextElement>
                  </div>
                </div>

                <div className="gift-card__text-box-container">
                  <div className="gift-card__text-box">
                    <TextElement>
                      Issuance beyond Plan Limits (To be charged at{" "}
                      {uses?.usage_charge}% of Value of Issuance)
                    </TextElement>
                  </div>
                  <div className="gift-card__text-box">
                    <TextElement align="left">
                      {uses?.usage_limit
                        ? parseFloat(uses?.usage_limit)?.toFixed(2)
                        : "Nill"}
                    </TextElement>
                  </div>
                </div>
              </div>

              {/* expected charges */}
              <div className="transaction-detail__plan-fees transaction-detail__box-bg">
                <div className="transaction-detail__detail-heading">
                  Expected Charges -{" "}
                  {uses?.planEndDate ? formatDate(uses?.planEndDate) : ""}
                </div>

                <div className="gift-card__text-box-container">
                  <div className="gift-card__text-box">
                    <TextElement>Subscription Fee</TextElement>
                  </div>
                  <div className="gift-card__text-box">
                    <TextElement align="left">
                      ₹
                      {uses?.montly_charge
                        ? parseFloat(uses?.montly_charge)?.toFixed(2)
                        : "Nill"}
                    </TextElement>
                  </div>
                </div>

                <div className="gift-card__text-box-container">
                  <div className="gift-card__text-box">
                    <TextElement>
                      Usage Fee (at {uses?.usage_charge}% of Value Issuance)
                    </TextElement>
                  </div>
                  <div className="gift-card__text-box">
                    <TextElement align="left">
                      ₹
                      {parseFloat(uses?.used_credit) >
                      parseFloat(uses?.given_credit)
                        ? (
                            ((parseFloat(uses?.used_credit) -
                              parseFloat(uses?.given_credit)) *
                              parseFloat(uses?.usage_charge)) /
                            100
                          ).toFixed(2)
                        : "00.00"}
                    </TextElement>
                  </div>
                </div>

                <div className="gift-card__text-box-container">
                  <TextElement align="right">Total</TextElement>
                  <div className="gift-card__text-box">
                    <TextElement align="left" id="total">
                      ₹
                      {parseFloat(
                        parseFloat(uses?.montly_charge) +
                          (parseFloat(uses?.used_credit) >
                          parseFloat(uses?.given_credit)
                            ? (
                                ((parseFloat(uses?.used_credit) -
                                  parseFloat(uses?.given_credit)) *
                                  parseFloat(uses?.usage_charge)) /
                                100
                              ).toFixed(2)
                            : parseFloat("00.00"))
                      ).toFixed(2)}
                    </TextElement>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="no-element">Currently Not Available</div>
      )}
    </div>
  );
};

export default CurrentUsages;

const formatDate = (dtObj, dt) => {
  const date = new Date(dtObj);
  const monthAr = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  if (dt === "fullDate") {
    return `${
      monthAr[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  }
  return `${monthAr[date.getMonth()]}, ${date.getFullYear()}`;
};
