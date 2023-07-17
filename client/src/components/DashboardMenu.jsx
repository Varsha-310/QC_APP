import React, { useCallback, useEffect, useState } from "react";
import {
  MyPlanIcon,
  StoreCredit,
  DownArrowIcon,
  MyGiftCardsIcon,
  ConfigIcon,
  GiftCardIcon,
  KycIcon,
  ResendMail,
} from "../assets/icons/svgs";
import "./styles/DashboardMenu.css";
import {
  Dot,
  NestedTabBox,
  SubTabBox,
  TabBox,
  TabItemLable,
  TabSubItemLable,
} from "./BasicComponents";
import { Link } from "react-router-dom";

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
              ACCOUNT SECTION
            </TabBox>

            <ul>
              <li>
                <SubTabBox
                  dropdown={"true"}
                  id="myplan"
                  onClick={handleDropDown}
                >
                  <MyPlanIcon />
                  <TabItemLable to={"/my-account"}>My Plan</TabItemLable>
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
                <SubTabBox>
                  <KycIcon />
                  {/* <img src={KycIcon} alt="" /> */}
                  <TabItemLable to={"/kyc-status"}>KYC Status</TabItemLable>
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
                <SubTabBox>
                  <GiftCardIcon />
                  {/* <img src={GiftCardIcon} alt="" /> */}
                  <TabItemLable to={"/create-giftcard"}>
                    Create Gift Card
                  </TabItemLable>
                </SubTabBox>
              </li>

              <li>
                <SubTabBox>
                  <MyGiftCardsIcon />
                  {/* <img src={MyGiftCardsIcon} alt="" /> */}
                  <TabItemLable to={"/my-gift-card"}>
                    My Gift Cards
                  </TabItemLable>
                </SubTabBox>
              </li>

              <li>
                <SubTabBox>
                  {/* <img src={ResendMail} alt="" /> */}
                  <ResendMail />
                  <TabItemLable to={"resend-gift-card"}>
                    Re-send Gift Card
                  </TabItemLable>
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
                <SubTabBox
                  dropdown={"true"}
                  id="credits"
                  onClick={handleDropDown}
                >
                  <StoreCredit />
                  <TabItemLable to={"/refunds"}>
                    Issue Store Credits
                  </TabItemLable>
                  <DownArrowIcon />
                </SubTabBox>
                {activeDropDown.credits && (
                  <NestedTabBox>
                    <div></div>
                    <TabSubItemLable to={"/refunds"}>
                      Listing Page
                    </TabSubItemLable>
                  </NestedTabBox>
                )}
              </li>
              <li>
                <SubTabBox>
                  <ConfigIcon />
                  <TabItemLable to={"/configuration"}>
                    Configuration
                  </TabItemLable>
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
            <TabBox to={"/"} active={`${activeTab?.home}`}>
              HOME
            </TabBox>
          </li>

          <li id="account" className="parent" onClick={handleTab}>
            <TabBox active={`${activeTab?.account}`} to={"/my-account"}>
              ACCOUNT SECTION
            </TabBox>

            <ul>
              <li>
                <SubTabBox
                  dropdown={"true"}
                  id="myplan"
                  onClick={handleDropDown}
                >
                  <MyPlanIcon />
                  <TabItemLable to={"/my-account"}>My Plan</TabItemLable>
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
                <SubTabBox>
                  <KycIcon />
                  {/* <img src={KycIcon} alt="" /> */}
                  <TabItemLable to={"/kyc-status"}>KYC Status</TabItemLable>
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
                <SubTabBox>
                  <GiftCardIcon />
                  {/* <img src={GiftCardIcon} alt="" /> */}
                  <TabItemLable to={"/create-giftcard"}>
                    Create Gift Card
                  </TabItemLable>
                </SubTabBox>
              </li>

              <li>
                <SubTabBox>
                  <MyGiftCardsIcon />
                  {/* <img src={MyGiftCardsIcon} alt="" /> */}
                  <TabItemLable to={"/my-gift-card"}>
                    My Gift Cards
                  </TabItemLable>
                </SubTabBox>
              </li>

              <li>
                <SubTabBox>
                  {/* <img src={ResendMail} alt="" /> */}
                  <ResendMail />
                  <TabItemLable to={"resend-gift-card"}>
                    Re-send Gift Card
                  </TabItemLable>
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
                <SubTabBox
                  dropdown={"true"}
                  id="credits"
                  onClick={handleDropDown}
                >
                  <StoreCredit />
                  <TabItemLable to={"/refunds"}>
                    Issue Store Credits
                  </TabItemLable>
                  <DownArrowIcon />
                </SubTabBox>
                {activeDropDown.credits && (
                  <NestedTabBox>
                    <div></div>
                    <TabSubItemLable to={"/refunds"}>
                      Listing Page
                    </TabSubItemLable>
                  </NestedTabBox>
                )}
              </li>
              <li>
                <SubTabBox>
                  <ConfigIcon />
                  <TabItemLable to={"/configuration"}>
                    Configuration
                  </TabItemLable>
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
