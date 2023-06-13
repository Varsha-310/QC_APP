import React, { useState } from "react";
import MyPlanIcon from "../assets/icons/svgs/Vector-14.svg";
import StoreCredit from "../assets/icons/svgs/Vector-16.svg";
import DownArrowIcon from "../assets/icons/svgs/Vector-17.svg";
import MyGiftCardsIcon from "../assets/icons/svgs/gift-cards.svg";
import ConfigIcon from "../assets/icons/svgs/Vector-3.svg";
import GiftCardIcon from "../assets/icons/svgs/Vector-15.svg";
import KycIcon from "../assets/icons/svgs/Vector-4.svg";
import ResendMail from "../assets/icons/svgs/ResendMail.svg";
import {
  Dot,
  NestedTabBox,
  SubTabBox,
  TabBox,
  TabItemLable,
  TabSubItemLable,
} from "./BasicComponents";

const DashboardMenu = () => {
  const [activeTab, setActiveTab] = useState({ home: true });
  const [activeDropDown, setActiveDropDown] = useState({
    myplan: false,
    credits: false,
  });

  const handleTab = (event) => {
    const id = event.target.id;
    setActiveTab({ [id]: true });
  };

  const handleDropDown = (event) => {
    event.stopPropagation();
    const id = event.currentTarget.id;
    setActiveDropDown((prev) => ({ ...prev, [id]: !activeDropDown[id] }));
  };

  return (
    <div className="dashboard-menu">
      <ul>
        <li>
          <TabBox
            to={"/"}
            active={activeTab?.home}
            id="home"
            onClick={handleTab}
          >
            HOME
          </TabBox>
        </li>

        <li>
          <TabBox
            active={activeTab?.account}
            id="account"
            onClick={handleTab}
          >
            ACCOUNT SECTION
          </TabBox>
        </li>
        <ul>
          <li>
            <SubTabBox dropdown={"true"} id="myplan" onClick={handleDropDown}>
              <img src={MyPlanIcon} alt="" />
              <TabItemLable to={"/billings"}>My Plan</TabItemLable>
              <img src={DownArrowIcon} alt="" />
            </SubTabBox>
          </li>

          {activeDropDown?.myplan && (
            <ul>
              <li>
                <NestedTabBox>
                  <Dot size="5px" fill={true} />
                  <TabSubItemLable to={"/billings"}>Billing Page</TabSubItemLable>
                </NestedTabBox>
              </li>
              <li>
                <NestedTabBox>
                  <Dot size="5px" fill={true} />
                  <TabSubItemLable to={"/transactions"}>Transaction Page</TabSubItemLable>
                </NestedTabBox>
              </li>
            </ul>
          )}

          <li>
            <SubTabBox>
              <img src={KycIcon} alt="" />
              <TabItemLable to={"/kyc-status"}>KYC Status</TabItemLable>
            </SubTabBox>
          </li>
        </ul>

        <li>
          <TabBox
            active={activeTab?.giftcard}
            id="giftcard"
            onClick={handleTab}
          >
            GIFT CARD
          </TabBox>
        </li>

        <ul>
          <li>
            <SubTabBox>
              <img src={GiftCardIcon} alt="" />
              <TabItemLable to={"/create-giftcard"}>Create Gift Card</TabItemLable>
            </SubTabBox>
          </li>

          <li>
            <SubTabBox>
              <img src={MyGiftCardsIcon} alt="" />
              <TabItemLable to={"/my-gift-card"}>My Gift Cards</TabItemLable>
            </SubTabBox>
          </li>

          <li>
            <SubTabBox>
              <img src={ResendMail} alt="" />
              <TabItemLable to={"resend-gift-card"}>Re-send Gift Card emails</TabItemLable>
            </SubTabBox>
          </li>
        </ul>

        <li>
          <TabBox
            active={activeTab?.storecredit}
            id="storecredit"
            onClick={handleTab}
          >
            STORE CREDIT
          </TabBox>
          <ul>
            <li>
              <SubTabBox
                dropdown={"true"}
                id="credits"
                onClick={handleDropDown}
              >
                <img src={StoreCredit} alt="" />
                <TabItemLable to={"/issue-store-credits"}>Issue Store Credits</TabItemLable>
                <img src={DownArrowIcon} alt="" />
              </SubTabBox>
              {activeDropDown.credits && (
                <NestedTabBox>
                  <div></div>
                  <TabSubItemLable to={"/refunds"}>Listing Page</TabSubItemLable>
                </NestedTabBox>
              )}
            </li>
            <li>
              <SubTabBox>
                <img src={ConfigIcon} alt="" />
                <TabItemLable to={"/configuration"}>Configuration</TabItemLable>
              </SubTabBox>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default DashboardMenu;
