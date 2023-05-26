import React, { useState } from "react";
import MyPlanIcon from "../assets/icons/svgs/Vector-14.svg";
import StoreCredit from "../assets/icons/svgs/Vector-16.svg";
import DownArrowIcon from "../assets/icons/svgs/Vector-17.svg";
import MyGiftCardsIcon from "../assets/icons/svgs/gift-cards.svg";
import ConfigIcon from "../assets/icons/svgs/Vector-3.svg";
import GiftCardIcon from "../assets/icons/svgs/Vector-15.svg";
import KycIcon from "../assets/icons/svgs/Vector-4.svg";
import { NestedTabBox, SubTabBox, TabBox, TabItemLable } from "./Components";

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
            to={"/account_section"}
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
              <TabItemLable>My Plan</TabItemLable>
              <img src={DownArrowIcon} alt="" />
            </SubTabBox>
          </li>
          {activeDropDown?.myplan && (
            <ul>
              <li>
                <NestedTabBox>Billing Page</NestedTabBox>
              </li>
              <li>
                <NestedTabBox>My Invoices</NestedTabBox>
              </li>
            </ul>
          )}
          <li>
            <SubTabBox>
              <img src={KycIcon} alt="" />
              <TabItemLable>KYC Status</TabItemLable>
            </SubTabBox>
          </li>
        </ul>

        <li>
          <TabBox
            to={"/gift_card"}
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
              <TabItemLable>Create Gift Card</TabItemLable>
            </SubTabBox>
          </li>
          <li>
            <SubTabBox>
              <img src={MyGiftCardsIcon} alt="" />
              <TabItemLable>My Gift Cards</TabItemLable>
            </SubTabBox>
          </li>
        </ul>
        <li>
          <TabBox
            to={"/store_credits"}
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
                <TabItemLable>Issue Store Credits</TabItemLable>
                <img src={DownArrowIcon} alt="" />
              </SubTabBox>
              {activeDropDown.credits && (
                <NestedTabBox>Listing Page</NestedTabBox>
              )}
            </li>
            <li>
              <SubTabBox>
                <img src={ConfigIcon} alt="" />
                <TabItemLable>Configuration</TabItemLable>
              </SubTabBox>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default DashboardMenu;
