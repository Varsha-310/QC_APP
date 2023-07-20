import React, { useState } from "react";
import { DownArrowIcon } from "../assets/icons/svgs";
import "./styles/DashboardMenu.css";
import {
  Dot,
  NestedTabBox,
  SubTabBox,
  TabBox,
  TabItemLable,
  TabSubItemLable,
} from "./BasicComponents";

import { AiOutlineUser, AiOutlineSetting } from "react-icons/ai";
import {
  HiOutlineIdentification,
  HiOutlineWallet,
  HiOutlineReceiptRefund,
} from "react-icons/hi2";
import { PiKeyReturn } from "react-icons/pi";
import { BsPostcard } from "react-icons/bs";

const DashboardMenu = () => {
  const [activeTab, setActiveTab] = useState({});

  const [activeDropDown, setActiveDropDown] = useState({
    myplan: false,
    credits: false,
  });

  const handleTab = (event) => {
    const id = event.target.closest(".parent").id;
    console.log(id);
    // setActiveTab({ [id]: true });
  };

  const handleDropDown = (event) => {
    // event.stopPropagation();
    const id = event.currentTarget.id;
    setActiveDropDown((prev) => ({ ...prev, [id]: !activeDropDown[id] }));
  };

  return (
    <div className="dashboard-menu">
      {/* PC view */}
      <nav className="dashboard__pc-menu">
        <ul className="dashboard__menu-items">
          <li id="home" className="parent" onClick={handleTab}>
            <TabBox to={"/home"} active={`${activeTab?.home}`}>
              HOME
            </TabBox>
          </li>

          <li id="account" className="parent" onClick={handleTab}>
            <TabBox active={`${activeTab?.account}`} to={"/my-account"}>
              MY ACCOUNT
            </TabBox>

            <ul>
              <li>
                <SubTabBox
                  dropdown={"true"}
                  id="myplan"
                  onClick={handleDropDown}
                  to={"/my-account"}
                >
                  <AiOutlineUser className="menu-icons" />
                  {/* <MyPlanIcon className="menu-icons" /> */}

                  <TabItemLable>My Plan</TabItemLable>
                  <DownArrowIcon />
                </SubTabBox>
              </li>

              {activeDropDown?.myplan && (
                <ul>
                  <li className="dashboard__menu-connect">
                    <NestedTabBox>
                      <Dot size="5px" fill={true} />
                      <TabSubItemLable to={"/my-invoices"}>
                        My Invoices
                      </TabSubItemLable>
                    </NestedTabBox>
                  </li>
                  <li className="dashboard__menu-connect">
                    <NestedTabBox>
                      <Dot size="5px" fill={true} />
                      <TabSubItemLable to={"/current-usage"}>
                        Current Usage
                      </TabSubItemLable>
                    </NestedTabBox>
                  </li>
                </ul>
              )}

              <li>
                <SubTabBox to={"/kyc-status"}>
                  {/* <KycIcon className="menu-icons" /> */}
                  <HiOutlineIdentification className="menu-icons" />
                  <TabItemLable>KYC Status</TabItemLable>
                </SubTabBox>
              </li>
            </ul>
          </li>

          <li id="giftcard" className="parent" onClick={handleTab}>
            <TabBox active={`${activeTab?.giftcard}`} to={"create-giftcard"}>
              GIFT CARD
            </TabBox>

            <ul>
              <li>
                <SubTabBox to={"/create-giftcard"}>
                  <BsPostcard
                    className="menu-icons"
                    style={{ width: "20px" }}
                  />
                  {/* <GiftCardIcon className="menu-icons" /> */}
                  <TabItemLable>Create Gift Card</TabItemLable>
                </SubTabBox>
              </li>

              <li>
                <SubTabBox to={"/my-gift-card"}>
                  {/* <MyGiftCardsIcon className="menu-icons" /> */}
                  <HiOutlineWallet className="menu-icons" />
                  <TabItemLable>My Gift Cards</TabItemLable>
                </SubTabBox>
              </li>

              <li>
                <SubTabBox to={"resend-gift-card"}>
                  <PiKeyReturn className="menu-icons" />
                  {/* <PiKeyReturn className="menu-icons" /> */}
                  <TabItemLable>Re-send Gift Card</TabItemLable>
                </SubTabBox>
              </li>
            </ul>
          </li>

          <li id="storecredit" className="parent" onClick={handleTab}>
            <TabBox active={`${activeTab?.storecredit}`} to={"/refunds"}>
              STORE CREDIT
            </TabBox>
            <ul>
              <li>
                <SubTabBox to={"/refunds"}>
                  {/* <StoreCredit className="menu-icons" /> */}
                  <HiOutlineReceiptRefund className="menu-icons" />
                  <TabItemLable>Issue Store Credits</TabItemLable>
                </SubTabBox>
              </li>
              <li>
                <SubTabBox to={"/configuration"}>
                  {/* <ConfigIcon className="menu-icons" /> */}
                  <AiOutlineSetting className="menu-icons" />
                  <TabItemLable>Preferences</TabItemLable>
                </SubTabBox>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      {/* -------------------------------- Tablet view ------------------------------------*/}
      <div className="dashboard__tab-menu">
        <ul className="dashboard__menu-items">
          <li id="home" className="parent" onClick={handleTab}>
            <TabBox to={"/home"} active={`${activeTab?.home}`}>
              HOME
            </TabBox>
          </li>

          <li id="account" className="parent" onClick={handleTab}>
            <TabBox active={`${activeTab?.account}`} to={"/my-account"}>
              MY ACCOUNT
            </TabBox>

            <ul>
              <li>
                <SubTabBox
                  dropdown={"true"}
                  id="myplan"
                  onClick={handleDropDown}
                  to={"/my-account"}
                >
                  <AiOutlineUser className="menu-icons" />
                  {/* <MyPlanIcon className="menu-icons" /> */}

                  <TabItemLable>My Plan</TabItemLable>
                  <DownArrowIcon />
                </SubTabBox>
              </li>

              {activeDropDown?.myplan && (
                <ul>
                  <li className="dashboard__menu-connect">
                    <NestedTabBox>
                      <Dot size="5px" fill={true} />
                      <TabSubItemLable to={"/my-invoices"}>
                        My Invoices
                      </TabSubItemLable>
                    </NestedTabBox>
                  </li>
                  <li className="dashboard__menu-connect">
                    <NestedTabBox>
                      <Dot size="5px" fill={true} />
                      <TabSubItemLable to={"/current-usage"}>
                        Current Usage
                      </TabSubItemLable>
                    </NestedTabBox>
                  </li>
                </ul>
              )}

              <li>
                <SubTabBox to={"/kyc-status"}>
                  {/* <KycIcon className="menu-icons" /> */}
                  <HiOutlineIdentification className="menu-icons" />
                  <TabItemLable>KYC Status</TabItemLable>
                </SubTabBox>
              </li>
            </ul>
          </li>

          <li id="giftcard" className="parent" onClick={handleTab}>
            <TabBox active={`${activeTab?.giftcard}`} to={"create-giftcard"}>
              GIFT CARD
            </TabBox>

            <ul>
              <li>
                <SubTabBox to={"/create-giftcard"}>
                  <BsPostcard
                    className="menu-icons"
                    style={{ width: "20px" }}
                  />
                  {/* <GiftCardIcon className="menu-icons" /> */}
                  <TabItemLable>Create Gift Card</TabItemLable>
                </SubTabBox>
              </li>

              <li>
                <SubTabBox to={"/my-gift-card"}>
                  {/* <MyGiftCardsIcon className="menu-icons" /> */}
                  <HiOutlineWallet className="menu-icons" />
                  <TabItemLable>My Gift Cards</TabItemLable>
                </SubTabBox>
              </li>

              <li>
                <SubTabBox to={"resend-gift-card"}>
                  <PiKeyReturn className="menu-icons" />
                  {/* <PiKeyReturn className="menu-icons" /> */}
                  <TabItemLable>Re-send Gift Card</TabItemLable>
                </SubTabBox>
              </li>
            </ul>
          </li>

          <li id="storecredit" className="parent" onClick={handleTab}>
            <TabBox active={`${activeTab?.storecredit}`} to={"/refunds"}>
              STORE CREDIT
            </TabBox>
            <ul>
              <li>
                <SubTabBox to={"/refunds"}>
                  {/* <StoreCredit className="menu-icons" /> */}
                  <HiOutlineReceiptRefund className="menu-icons" />
                  <TabItemLable>Issue Store Credits</TabItemLable>
                </SubTabBox>
              </li>
              <li>
                <SubTabBox to={"/configuration"}>
                  {/* <ConfigIcon className="menu-icons" /> */}
                  <AiOutlineSetting className="menu-icons" />
                  <TabItemLable>Preferences</TabItemLable>
                </SubTabBox>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardMenu;
