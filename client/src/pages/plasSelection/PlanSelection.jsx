import React, { useEffect, useState } from "react";
import "./styles/PlanSelection.css";
import Tick from "../../assets/icons/svgs/tick.svg";
import {
  CustomBtn,
  PrimaryBtn,
  RectBtn,
  SectionHeading1,
  SectionPara,
  SectionTitle,
} from "../../components/BasicComponents";
import { Link } from "react-router-dom";
import PlanCard from "../../components/PlanCard";
import instance from "../../axios";
import { getUserToken } from "../../utils/userAuthenticate";
import { createPortal } from "react-dom";

const PlanSelection = () => {
  const tableContent = [
    {
      title: "Provide a prepaid e-card",
      basic: true,
      pro: true,
      premium: true,
      enterprise: true,
    },
    {
      title: "Delivery template and thems for e-gift cards",
      basic: false,
      pro: true,
      premium: true,
      enterprise: true,
    },
    {
      title: "Issue Physical Gift Card (pre-paid)",
      basic: false,
      pro: false,
      premium: false,
      enterprise: true,
    },
    {
      title: "Bulk Issuance Tool",
      basic: false,
      pro: false,
      premium: false,
      enterprise: true,
    },
    {
      title: "Report dashboard for all gift card transactions",
      basic: false,
      pro: true,
      premium: true,
      enterprise: true,
    },
    {
      title: "Scheduled Reports: Daily, Weekly, Monthly",
      basic: true,
      pro: true,
      premium: true,
      enterprise: true,
    },
    {
      title: "Omni channel integration (Store POS, Website, Mobile app)",
      basic: false,
      pro: false,
      premium: false,
      enterprise: true,
    },
    {
      title: "Customised Issuane and Redemption rules",
      basic: false,
      pro: false,
      premium: false,
      enterprise: true,
    },
    {
      title: "Distribution in Corporate & online channels",
      basic: false,
      pro: false,
      premium: true,
      enterprise: true,
    },
    {
      title: "Retail Distribution as per requirements (online to off-line)",
      basic: false,
      pro: false,
      premium: false,
      enterprise: true,
    },
  ];
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState(null);
  const [terms, setTerms] = useState(false);

  // get plans
  const fetchPlan = async () => {
    const url = "/plan/list";
    const headers = {
      Authorization: getUserToken(),
    };

    try {
      const res = await instance.post(url, {}, { headers });
      setPlans(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }

    // console.log(res);
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  return (
    <div className="plan-selection-container container_padding">
      {terms &&
        createPortal(
          <TermsPopUp setTerms={setTerms} />,
          document.getElementById("portal")
        )}

      <div className="section-box-container">
        <div className="section-box-title">Qwikcilver App Registration</div>
        <div className="section-box-subtitle">
          To complete registration, provide the necessary details and choose
          your subscription plan.
        </div>

        <SectionTitle size="14px" weight="600" lineheight="24px" align="left">
          <span style={{ color: "red" }}>*</span>Marked as Mandatory
        </SectionTitle>
      </div>

      {/* <div className="plan-selection__plan-type">
        <div className="plan-selection__plan-annually">Annually</div>
        <div className="plan-selection__plan-monthly">Monthly</div>
      </div> */}

      {/* plans */}
      <div className="package-detail">
        <RectBtn
          border=" "
          width="100%"
          height="45px"
          weight="400"
          active={false}
        >
          Describe your detail here
        </RectBtn>
        <RectBtn
          border=" "
          width="100%"
          height="45px"
          weight="400"
          active={true}
        >
          Select a package
        </RectBtn>
      </div>
      <div className="plans">
        {plans?.data?.plans.map((plan, index) => {
          return (
            <PlanCard
              key={index}
              plan={plan}
              popular={plan?.plan_name === "Pro" ? true : false}
              btnText={"Select"}
              active={
                selectedPlan?.plan_name === plan?.plan_name ? true : false
              }
              setPlan={setSelectedPlan}
            />
          );
        })}
      </div>

      <div className="section-box-container">
        <div className="terms-check">
          <input type="checkbox" /> I accept Gift Card Processing
          <Link onClick={() => setTerms(true)}>Terms & Conditions</Link>
        </div>
      </div>

      <div style={{ margin: "40px 0px" }}>
        <PrimaryBtn $primary>Confirm Payment</PrimaryBtn>
      </div>

      {/* enterprise plan box */}

      <div className="enterprise_plan-box">
        {/* <SectionHeading1 weight="600" size="24px" lineheight="30px">
          Enterprise Plan
        </SectionHeading1> */}
        <div className="plan-box-title">Enterprise Plan</div>
        <p className="box-text">
          We provide more flexible plans for enterprise. Please contact us to
          get the ultimate solution for you.
        </p>
        <a href="mailto:">
          E-mail:<span>sales@qwikcilver.com</span>
        </a>
      </div>

      <SectionHeading1
        size="20px"
        weight="500"
        lineheight="20px"
        align="center"
        margin="35px 0px"
      >
        Compare Gift Card Benefits
      </SectionHeading1>

      {/* plan table */}
      <table className="plan-table">
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>Basic</th>
            <th>Pro</th>
            <th>Premium</th>
            <th>Enterprise</th>
          </tr>
        </thead>
        <tbody>
          {tableContent.map((rowData) => {
            return (
              <tr>
                <td>{rowData.title}</td>
                <td>
                  {rowData.basic ? (
                    <img src={Tick} alt="" />
                  ) : (
                    <span className="dash"></span>
                  )}
                </td>
                <td>
                  {rowData.pro ? (
                    <img src={Tick} alt="" />
                  ) : (
                    <span className="dash"></span>
                  )}
                </td>
                <td>
                  {rowData.premium ? (
                    <img src={Tick} alt="" />
                  ) : (
                    <span className="dash"></span>
                  )}
                </td>
                <td>
                  {rowData.enterprise ? (
                    <img src={Tick} alt="" />
                  ) : (
                    <span className="dash"></span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PlanSelection;

const TermsPopUp = ({ setTerms }) => {
  return (
    <div className="terms-pop__container">
      <h2>TERMS AND CONDITIONS GOVERNING THE GIFT CARD PROCESSING SERVICES</h2>

      <ol>
        <li>
          The Merchant Issuer is desirous of issuing the Gift card and launching
          the gift card program by leveraging the technical capabilities and
          services of Pine Labs. This Agreement describes the framework upon
          which Pine Labs has agreed to offer (i) its gift card solutions (“gift
          cards”), to the Merchant (“Merchant Issuer”). The specifications,
          scope and the manner in which the solutions will be provided are set
          out in Annexure A hereto (“Project”).
        </li>
        <li>
          The products covered by this Agreement consist of the gift cards,
          software applications and other devices, if any, provided by Pine Labs
          for the purposes of the Project.
        </li>
        <li>
          The commercial terms agreed by the parties for the purposes of the
          Project are set out in Annexure B hereto. The primary responsibilities
          of the Merchant Issuer are set out in Annexure C hereto. Each Party
          will designate a representative to act as the primary point-
          of-contact for the purposes of this Agreement.
        </li>
        <li>
          Subject to the limitation of liability, each party shall indemnify,
          defend and hold harmless the other from and against any and all direct
          damages, liability, losses, costs and expenses (including reasonable
          attorneys’ fees) relating to or arising out of the breach of this
          Agreement, the negligence or willful misconduct of either party, or
          its employees or agents.
        </li>
        <li>
          Pine Labs shall endeavor to ensure that its products and services meet
          the specifications set out herein in all material aspects, at the time
          of implementation. If the Merchant Issuer is of the opinion that Pine
          Labs products or services do not conform to the specifications set out
          herein, Pine Labs will use commercially reasonable efforts to correct
          or remedy such non-conformance.
        </li>
        <li>
          For the avoidance of doubt, it is hereby clarified that the Merchant
          Issuer shall, at all times, be the issuer under law, of the gift cards
          issued under this Agreement. Pine Labs shall be the technology partner
          powering the gift card program, under instructions from the Merchant
          Issuer. Pine Labs products and services are provided on an “as is”
          basis. Except as expressly stated in Clause 6, Pine Labs hereby
          disclaims all express and implied warranties, including, without
          limitation, any implied warrantiesof merchantability and fitness for a
          particular purpose.
        </li>
        <li>
          Confidentiality: Each party shall treat all data and information
          including the commercial terms and the terms and conditions agreed
          between the parties hereunder (including Cardholder information),
          (&quot;Confidential Information&quot;), disclosed to it or which comes
          into its possession or knowledge in connection with this arrangement
          as confidential. Further, the Merchant Issuer hereby agrees Pine Labs
          may use the personal information of the Merchant Issuer in any
          marketing or promotional activities associated with the Project at any
          time during the term of this Agreement.
        </li>
        <li>
          Notwithstanding anything stated in this arrangement, both parties
          agree that all proprietary intellectual property including, software,
          computer programs and systems generated by Pine Labs, on the
          server/systems of Pine Labs in relation to this arrangement, shall be
          the sole and exclusive property of Pine Labs.
        </li>
        <li>
          Merchant Issuer will not and will not permit others to: (i) copy,
          adapt, alter, modify, merge or create derivative works of Pine Labs
          software applications; (ii) reverse-engineer, disassemble, or
          decompile Pine Labs software applications or otherwise attempt to
          determine its underlying source code; or (iii) sell, lease, sublicense
          or provide any portion of Pine Labs’ software applications to any
          third party.
        </li>
        <li>
          While data/information relating to Merchant Issuer such as name,
          address, trademark, logo etc.(Merchant Issuer Data) is the exclusive
          property of Customer, Pine Labs is authorized to have legal and
          physical access to and make use of all such Merchant Issuer Data for
          purpose of performing the Services provided by Pine Labs through its
          Distribution channels and social media to facilitate sale of Merchant
          Gift Card and for purposes of data analysis and marketing in
          accordance with Pine Labs Privacy Policy.
        </li>
        <li>
          The arrangement contemplated by these terms shall commence from the
          Effective Date and remain in force unless terminated with 1 (one)
          months’ notice in writing by either party.
        </li>
        <li>
          Upon termination or expiration of this Agreement: (i) any and all
          payment obligations of Merchant Issuer that have accrued shall become
          immediately due and payable; (ii) products issued prior to termination
          shall 2 continue to be valid till the expiry of the product and the
          parties shall fulfill their respective obligations with respect to
          those Cards as if the arrangement is not terminated; (iii) Merchant
          Issuer shall promptly return to Pine Labs, its confidential
          information, software applications and all materials provided pursuant
          to this Agreement; (iv) Merchant Issuer shall uninstall Pine Labs
          software applications installed on its systems; and (v) Pine Labs will
          provide to the Merchant Issuer, an updated MIS setting out the details
          of all transactions undertaken by the customers of the Merchant
          Issuer, upto the effective date of termination of this Agreement.
        </li>
        <li>
          <b> Dispute Resolution:</b> Any and all disputes arising from this
          agreement shall be resolved through arbitration by a single arbitrator
          appointed by mutual agreement of the Parties, in accordance with the
          Arbitration and Conciliation Act, 1996.
        </li>

        <li>
          <b>Governing Law and Jurisdiction:</b> This Agreement shall be
          governed by the laws of India. Subject to Clause 14 above, nothing
          contained in this clause will preclude either party from applying for
          and obtaining any injunctive, prohibitory or other similar urgent or
          interim relief from a competent court of law, for which the courts at
          Delhi shall have exclusive jurisdiction.
        </li>
        <li>
          <b> Notices:</b> Any notices, requests and other communications
          required or permitted hereunder shall be in writing and shall be given
          by hand against written acknowledgement or receipt, or sent by
          registered mail, followed by a confirmation letter by registered mail,
          at or to each of the parties at the addresses set forth herein above.
        </li>
        <li>
          Amendments: This Agreement can be modified, supplement or amended only
          by written agreement executed by both parties.
        </li>
      </ol>

      <h2>ANNEXURE A</h2>

      <h2>PROJECT AND SCOPE OF SERVICE</h2>
      <h4>A: For Launching and Managing the Gift Card Program</h4>
      <p>
        Pine Labs will provide the services to the Client to launch and manage
        the Gift Card Program on SaaS model.
      </p>
      <p>
        As part of the overall solution to the Client, Pine Labs will provide
        the following services:
      </p>
      <ol>
        <li>
          Will provide software for transaction initiation or redemption of
          cards at merchant’s online store.
        </li>
        <li>
          Will setup gift card programs on Pine Labs server based on agreed
          program requirements with the Client;
        </li>
        <li>
          Host and manage Pine Labs transaction processing server on the
          internet;
        </li>
        <li>
          Manage all server-side maintenance, database back-ups and all regular
          management activities;
        </li>
        <li>
          Authorize all Gift card transactions and capture transaction data for
          tracking, reconciliation, and reporting;
        </li>
        <li>
          Provide a standard set of MIS reports for program tracking and
          settlement.
        </li>
      </ol>

      <h4>B: Process for Issuance of gift cards from Merchant Website:</h4>
      <ol>
        <li>
          Merchant should download the Pine Labs Plugin from Shopify App store
          and complete the KYC and onboarding processes.
        </li>
        <li>
          Once Merchant is onboarded to Pine Labs platform, the merchant will be
          able to list Gift cards as a salable SKU on Merchant website.
        </li>
        <li>
          Customer selects the quantity and denomination and makes payment via
          Payment gateway.
        </li>
        <li>
          Upon successful payment processing, the customer gets the digital card
          which will have a 16-digit card number and separate 14-digit pin via
          email.
        </li>
      </ol>

      <h4>C: Process for Issuance of Refund Cards from Merchant Website:</h4>
      <ol>
        <li>
          Merchant should download the Pine Labs Plugin from Shopify App store
          and complete the KYC and onboarding processes.
        </li>
        <li>
          Once Merchant is onboarded to Pine Labs platform, the merchant will be
          able to Issue Refund Cards (also called Store-Credits) using the
          plugin’s refund dashboard.
        </li>
      </ol>

      <h4>D: Process for Redemption of Refund Cards from Merchant Website:</h4>
      <ol>
        <li>Customer visits the Merchant Website with the e-gift card code.</li>
        <li>
          Customer will need to add the gift card to the online merchant wallet,
          that Pine Labs will be creating for each customer desirous of
          redeeming gift card. This gift card balance will be updated instantly,
          once the customer uses the Add-to-Wallet Balance functionality on the
          merchant website.
        </li>
        <li>Customer avails the product or service desired.</li>
        <li>
          At the time of tendering, the customer will use the balance present in
          the online wallet for redemption.
        </li>
        <li>
          Bill amount in excess of the Gift Card value should be collected by
          the merchant website directly via the payment gateway.
        </li>
        <li>
          All support in relation to the transaction of the e-gift card will be
          handled by Pine Labs helpdesk.
        </li>
      </ol>

      <h2>ANNEXURE B</h2>
      <h3>COMMERCIAL TERMS</h3>
      <p>
        The commercials provided are for usage of the Technology platform
        provided for issuance and acceptance of the Merchant gift card.
      </p>
      <ul>
        <li>
          For all Gift cards and refund cards issued by the merchant, Pine Labs
          will charge as per the Pricing Plan detailed below.
        </li>
        <li>
          Pine Labs reserves the right to change this Price Plan and Plan
          Features available for merchants at its discretion.
        </li>
        <li>
          This Plan will not be applicable in case Pine Labs and the Merchant
          enter into a separate commercial agreement with custom pricing for the
          issuance of gift cards and refund cards.
        </li>
      </ul>

      {/* table */}
      <h2>Pricing Plans</h2>
      <table>
        <tr>
          <th>
            Pine Labs App for Merchants on Shopify - Pricing Plans Basic Pro
            Premium Same Pricing for both Gift Card &amp; Refund Issuance
          </th>
          <th>Basic</th>
          <th>Pro</th>
          <th>Premium</th>
        </tr>
        <tr>
          <td>Subscription Fee (Price / Per Month $)</td>
          <td>$5.0</td>
          <td>$10</td>
          <td>$20</td>
        </tr>
        <tr>
          <td>Subscription Fee (Price / Per Month INR)</td>
          <td>₹399</td>
          <td>₹799</td>
          <td>₹1,599</td>
        </tr>
        <tr>
          <td>Subscription Limits (Monthly Digital Issuance)</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>
            Total Issuance Value as part of subscription (Limit per month)
          </td>
          <td>20,000</td>
          <td>40,000</td>
          <td>80,000</td>
        </tr>
        <tr>
          <td>Usage Fee (For Issuance above Subscription plan limits)</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>GC Issuance above limits (As % of value of issuance)</td>
          <td>2.50%</td>
          <td>2.3%</td>
          <td>2.00%</td>
        </tr>
        <tr>
          <td>Usage Issuance Cap</td>
          <td>1,00,000</td>
          <td>1,50,000</td>
          <td>2,00,000</td>
        </tr>
        <tr>
          <td>Plan Features</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>Issue Digital Gift Cards &amp; Refund Cards</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td>
            Online Wallet for End Users (for storing Gift &amp; Refund cards)
          </td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td>Pre-packaged templates for e-gift cards</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td>Fixed Denominations</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td>Variable Denominations</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td>Issue Physical Gift Card</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td>Bulk Issuance Tool</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td>Scheduled Reports: Daily, Weekly, Monthly</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td>Realtime dashboard for all gift card transactions</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td>Omni channel integration (Store POS, Website, Mobile app)</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td>Customised Issuance and Redemption rules</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td>Distribution in Corporate &amp; online channels</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td>Retail Distribution as per requirements (online to off-line)</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
      </table>

      {/*  */}
      <h2>Roles &amp; Responsibilities</h2>
      <h3>Merchant’s Roles &amp; Responsibilities</h3>
      <ol>
        <li>
          Install the Pine Labs plugin (also called app) from the Shopify App
          Store
        </li>
        <li>
          Complete the Online KYC Process, to help Pine Labs onboard the
          merchant to its Pine Labs Electronic Gift Card Management Platform
        </li>
        <li>Pay the monthly subscription as published by Pine Labs</li>
        <li>
          Configure the Pine Labs plugin as per the instructions of Pine Labs
        </li>
        <li>
          Enable the necessary internal mechanisms &amp; processes to issue gift
          cards &amp; refund cards to end customers
        </li>
        <li>
          After the sale (of gift cards) AND / OR distribution (of refund gift
          cards), the Card shall entitle the bearer of the said Card to shop for
          the amount mentioned on the Card on the Merchant’s Platform. The
          Merchant shall be responsible for allowing redemption of the Gift Card
          and will be responsible for providing clear instructions on how to
          redeem the same, to the customer.
        </li>
        <li>
          Merchant will be prompt in the payment of monthly subscriptions as per
          the due dates communicated by Pine Labs
        </li>
        <li>
          The Gift Card terms and conditions are set out in Exhibit A hereto.
        </li>
      </ol>

      <h3>Pine Labs Roles &amp; Responsibilities</h3>
      <ol>
        <li>
          Host and manage Pine Labs transaction processing server on the
          internet;
        </li>
        <li>
          Manage all server-side maintenance, database back-ups and all regular
          management activities;
        </li>
        <li>
          Help merchants issue gift cards and refund cards as per the pricing
          plan published on the Shopify platform
        </li>
        <li>
          Store the details of gift cards and refund cards issued along with any
          customer data (as applicable)
        </li>
        <li>
          Authorize and Validate gift cards when presented for redemption on the
          merchant website
        </li>
        <li>
          Process the redemption transactions and maintain the record of
          redemption transactions. Capture transaction data for tracking,
          reconciliation, and reporting;
        </li>
        <li>
          Publish a periodic report detailing the volume and value of gift card
          issuances and redemptions done on behalf of the merchant
        </li>
      </ol>

      <h2>EXHIBIT A</h2>
      <h3>("Gift cards Terms &amp; Conditions")</h3>
      <p>Terms and Conditions of Gift Card</p>
      <ol>
        <li>
          E Gift Card is valid for a period of 12 months from its date of issue.
        </li>
        <li>
          This Gift Card shall be subject to applicable laws or any new law,
          rules and/or regulations as may be promulgated / imposed by the
          Government, RBI, or any other statutory/regulatory authority.
        </li>
        <li>
          No returns and no refunds on gift cards purchased through Pine Labs
          channels (for example woohoo.in.) Please check the refund policy at{" "}
          <a href="http://www.woohoo.in/faq">http://www.woohoo.in/faq</a> for
          further details.
        </li>
        <li>
          E Gift Card is redeemable for merchandise at Merchant’s website and
          retail outlet within India. This Gift Voucher is redeemable during its
          validity.
        </li>
        <li>
          E Gift Card is not redeemable for cash or credit nor can be exchanged
          for another Gift card.
        </li>
        <li>
          If the invoice value is greater than the Gift Card value, the customer
          can pay the balance amount through Cash, Debit Card, and Credit Card
          as the case may be.
        </li>
        <li>
          Merchant shall not be liable and responsible for any unauthorized
          and/or fraudulent purchase/s made using this E Gift Card.
        </li>
        <li>
          The holder of this E Gift Card shall be solely responsible for the
          safe custody of the E Gift Card and the credentials mentioned on it. E
          Gift Card is a bearer instrument.
        </li>
        <li>
          For balance enquiry &amp; expiry, visit{" "}
          <a href="https://www.woohoo.in/balenq">
            https://www.woohoo.in/balenq
          </a>
        </li>
        <li>
          Merchant reserves the right to amend the terms &amp; conditions at its
          discretion without prior notice.
        </li>
        <li>Disputes if any, shall be subject to Delhi jurisdiction.</li>
        <li>
          E-gift cards are normally delivered instantly. But sometimes delivery
          can be delayed up-to 24 - 48 hours.
        </li>
      </ol>
      <br />
      <PrimaryBtn onClick={() => setTerms(false)}>Close</PrimaryBtn>
    </div>
  );
};
