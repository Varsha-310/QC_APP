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
            <TabBox to={"/"} active={`${activeTab?.home}`}>
              HOME
            </TabBox>
          </li>

          <li id="account" className="parent" onClick={handleTab}>
            <TabBox active={`${activeTab?.account}`} to={"/billings"}>
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
                  <TabItemLable to={"/billings"}>My Plan</TabItemLable>
                  <DownArrowIcon />
                </SubTabBox>
              </li>

              {activeDropDown?.myplan && (
                <ul>
                  <li>
                    <NestedTabBox>
                      <Dot size="5px" fill={true} />
                      <TabSubItemLable to={"/billings"}>
                        My Invoices
                      </TabSubItemLable>
                    </NestedTabBox>
                  </li>
                  <li>
                    <NestedTabBox>
                      <Dot size="5px" fill={true} />
                      <TabSubItemLable to={"/transactions"}>
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
            <TabBox active={`${activeTab?.storecredit}`}>STORE CREDIT</TabBox>
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
                  <DownArrowIcon/>
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

      {/* Tablet view */}
      <div className="dashboard__tab-menu">
        <ul className="dashboard__menu-items">
          <li id="home" className="parent" onClick={handleTab}>
            <TabBox to={"/"} active={`${activeTab?.home}`}>
              HOME
            </TabBox>
          </li>

          <li id="account" className="parent" onClick={handleTab}>
            <TabBox active={`${activeTab?.account}`} to={"/billings"}>
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
                  <TabItemLable to={"/billings"}>My Plan</TabItemLable>
                  <DownArrowIcon />
                </SubTabBox>
              </li>

              {activeDropDown?.myplan && (
                <ul>
                  <li>
                    <NestedTabBox>
                      <Dot size="5px" fill={true} />
                      <TabSubItemLable to={"/billings"}>
                        Billing Page
                      </TabSubItemLable>
                    </NestedTabBox>
                  </li>
                  <li>
                    <NestedTabBox>
                      <Dot size="5px" fill={true} />
                      <TabSubItemLable to={"/transactions"}>
                        Transaction Page
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
            <TabBox active={`${activeTab?.storecredit}`}>STORE CREDIT</TabBox>
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
                  <img src={DownArrowIcon} alt="" />
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
