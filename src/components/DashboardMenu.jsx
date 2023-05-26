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

  const handleTab = (event) => {
    const id = event.target.id;
    setActiveTab({ [id]: true });
  };
  return (
    <div className="dashboard-menu">
      {/* home */}
      <TabBox to={"/"} active={activeTab?.home} id="home" onClick={handleTab}>
        HOME
      </TabBox>

      {/* accounts */}
      <TabBox
        to={"/account_section"}
        active={activeTab?.account}
        id="account"
        onClick={handleTab}
        >
        ACCOUNT SECTION
      </TabBox>
      <SubTabBox dropDown={true}>
        <img src={MyPlanIcon} alt="" />
        <TabItemLable>My Plan</TabItemLable>
        <img src={DownArrowIcon} alt="" />
      </SubTabBox>
          <NestedTabBox>Billing Page</NestedTabBox>
          <NestedTabBox>My Invoices</NestedTabBox>
      <SubTabBox>
        <img src={KycIcon} alt="" />
        <TabItemLable>KYC Status</TabItemLable>
      </SubTabBox>

      {/* gift card */}
      <TabBox
        to={"/gift_card"}
        active={activeTab?.giftcard}
        id="giftcard"
        onClick={handleTab}
      >
        GIFT CARD
      </TabBox>
      <SubTabBox>
        <img src={GiftCardIcon} alt="" />
        <TabItemLable>Create Gift Card</TabItemLable>
      </SubTabBox>
      <SubTabBox>
        <img src={MyGiftCardsIcon} alt="" />
        <TabItemLable>My Gift Cards</TabItemLable>
      </SubTabBox>

      {/* store credit */}
      <TabBox
        to={"/store_credits"}
        active={activeTab?.storecredit}
        id="storecredit"
        onClick={handleTab}
      >
        STORE CREDIT
      </TabBox>
      <SubTabBox dropDown={true}>
        <img src={StoreCredit} alt="" />
        <TabItemLable>Issue Store Credits</TabItemLable>
        <img src={DownArrowIcon} alt="" />
      </SubTabBox>
      <NestedTabBox>Listing Page</NestedTabBox>
      <SubTabBox>
        <img src={ConfigIcon} alt="" />
        <TabItemLable>Configuration</TabItemLable>
      </SubTabBox>
    </div>
  );
};

export default DashboardMenu;
