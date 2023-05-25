import React, { useState } from "react";
import { TabBox } from "./Components";

const DashboardMenu = () => {
  const [activeTab, setActiveTab] = useState({ home: true });

  const handleTab = (event) => {
    const id = event.target.id;
    setActiveTab({ [id]: true });
  };
  return (
    <div className="dashboard-menu">
      <TabBox to={"/"} active={activeTab?.home} id="home" onClick={handleTab}>
        HOME
      </TabBox>
      <TabBox
        to={"/account_section"}
        active={activeTab?.account}
        id="account"
        onClick={handleTab}
      >
        ACCOUNT SECTION
      </TabBox>
      <TabBox
        to={"/gift_card"}
        active={activeTab?.giftcard}
        id="giftcard"
        onClick={handleTab}
      >
        GIFT CARD
      </TabBox>
      <TabBox
        to={"/store_credits"}
        active={activeTab?.storecredit}
        id="storecredit"
        onClick={handleTab}
      >
        STORE CREDIT
      </TabBox>
    </div>
  );
};

export default DashboardMenu;
