import { useState } from "react";
import useScrollTop from "../../hooks/useScrollTop";
import "./styles/FaqPage.css";
import { BiChevronDown } from "react-icons/bi";
const FaqPage = () => {
  const [activeSection, setActiveSection] = useState({});

  useScrollTop();

  // to handle active section
  const handleActive = (event) => {
    event.preventDefault();
    const id = event.target.id;
    setActiveSection((prev) => ({
      ...prev,
      [id]: prev.hasOwnProperty(id) ? !prev[id] : true,
    }));
  };

  return (
    <div className="component">
      <div className="component-primary-heading">FAQ’s</div>

      <div className="faq-component">
        <div className="faq-sections">
          <div className="faq-section__title" onClick={handleActive} id="about">
            ABOUT QWIKCILVER{" "}
            <BiChevronDown
              className={`faq-section__icon ${
                activeSection?.about ? "icon_up" : ""
              }`}
            />
          </div>
          {activeSection?.about && (
            <ul>
              <li>
                <p>
                  What are the functionalities, that I will get from the
                  Qwikcilver Refunds &amp; Gift Cards App?
                </p>

                <p>
                  Using the Qwikcilver App, a merchant can achieve the following
                  business functionalities.
                </p>
                <ul>
                  <li>
                    Allow your customers to purchase gift cards from your online
                    store
                  </li>
                  <li>
                    Allow your staff to effortlessly issue e-refunds against
                    returned orders
                  </li>
                </ul>
              </li>
              <li>
                <p>
                  Why should I use Qwikcilver App for generating gift cards and
                  e-refunds?
                </p>
                <p>
                  The Qwikcilver platform is trusted by India’s leading retail
                  &amp; e-commerce brands to manage their gift cards and
                  e-refunds issuances. Some of the brands using the Qwikcilver
                  platform include Amazon, Uber, Flipkart, Myntra, Nykaa,
                  ClearTrip, Tata Cliq, Lifestyle, Shoppers Stop, Titan and many
                  more. Since gift cards and e-refunds are equivalent to brand
                  currency, and Qwikcilver follows the highest security
                  standards during their issuance &amp; redemption. Besides the
                  various business benefits, the Qwikcilver platform allows
                  merchants to seamlessly track every issuance and redemption of
                  gift cards through comprehensive reports.
                </p>
              </li>
              <li>
                <p>
                  What are the business benefits of using the Qwikcilver App to
                  issue gift cards and e-refunds to customers?
                </p>
                <p>
                  The following are the five main benefits for promoting gift
                  card as a product on your online store:
                </p>
                <ul>
                  <li>
                    Merchant receives upfront money for a service to be rendered
                    at a later date
                  </li>
                  <li>
                    Guaranteed uplift (or spends over-and-above the gift card
                    value), on every redemption transaction
                  </li>
                  <li>
                    New prospective customers and referrals (through personal
                    &amp; corporate gifting using gift cards)
                  </li>
                  <li>
                    Prospect of bulk revenues (from large rewards catalogs)
                  </li>
                  <li>
                    Chances of gift cards going un-redeemed (called breakage)
                  </li>
                </ul>
                <p>
                  The following are the five main benefits for having e-refunds
                  OR store-credit program:
                </p>
                <ul>
                  <li>
                    Store-Credits can help D2C merchants manage and track
                    refunds more efficiently
                  </li>
                  <li>
                    For COD Orders that need to be refunded, an e-refund or
                    store-credit is more convenient and cost effective than a
                    bank transfer / bank cheque. No need to collect bank details
                    from customers.
                  </li>
                  <li>
                    For Pre-paid Orders that needs to be refunded, e-refunds or
                    store-credits can help merchants retain the cash flow from
                    the original order
                  </li>
                  <li>
                    By retaining the customer, the merchant can also save on the
                    entire gamut of costs, that would have originally been
                    incurred for acquiring and servicing the customer
                  </li>
                  <li>
                    E-refunds are credited instantly to customers, for use
                    immediately on the next order, thereby ensuring customer
                    delight and stickiness
                  </li>
                </ul>
              </li>
              <li>
                <p>
                  Can I generate gift cards in bulk using the Qwikcilver app?
                </p>
                <p>
                  The bulk generation of gift cards is available for
                  Qwikcilver’s Enterprise clients. Please reach out to
                  <a href="mailto:care@qwikcilver.com">
                    care@qwikcilver.com
                  </a>{" "}
                  to start a conversation to migrate you to an Enterprise Plan.
                </p>
              </li>
            </ul>
          )}
        </div>

        <div className="faq-sections">
          <div
            onClick={handleActive}
            id="onboarding"
            className="faq-section__title"
          >
            MERCHANT ONBOARDING{" "}
            <BiChevronDown
              className={`faq-section__icon ${
                activeSection?.onboarding ? "icon_up" : ""
              }`}
            />
          </div>
          {activeSection?.onboarding && (
            <ol>
              <li>
                <p>
                  What are the merchant onboarding details, that I need to
                  provide to Qwikcilver?
                </p>
                <p>
                  While registering on the Qwikcilver App, a merchant needs to
                  provide the Business PAN number, CIN Number, GST Number and
                  the Billing / Communication address.
                </p>
              </li>
              <li>
                <p>
                  How long will it take to get my account to be activated after
                  submitting the onboarding details and completing the payment?
                </p>
                <p>
                  Once the merchant completes the subscription payment,
                  Qwikcilver strives to set up the merchant on its systems as
                  quickly as possible. This initial configuration usually is
                  done under 1 to 2 hours.
                </p>
              </li>
              <li>
                <p>
                  How can I access my Qwikcilver Refunds &amp; Gift Cards
                  Dashboard?
                </p>
                <p>
                  The Qwikcilver dashboard can be accessed only via the Shopify
                  account. Please login to your store dashboard using your
                  Shopify credentials, and then navigate to the Apps section on
                  the Left Navigation Menu.
                </p>
              </li>
            </ol>
          )}
        </div>

        <div className="faq-sections">
          <div
            onClick={handleActive}
            id="configuration"
            className="faq-section__title"
          >
            MERCHANT CONFIGURATIONS{" "}
            <BiChevronDown
              className={`faq-section__icon ${
                activeSection?.configuration ? "icon_up" : ""
              }`}
            />
          </div>

          {activeSection?.configuration && (
            <div className="tableBody">
              <table>
                <tr>
                  <th>Steps</th>
                  <th>Configuring the Qwikcilver App</th>
                  <th>Configuration Location</th>
                  <th>Spcial Remarks</th>
                </tr>
                <tr>
                  <td>Step 1</td>
                  <td>Configure Currency & Markets </td>
                  <td>Shopify Admin Settings</td>
                  <td>
                    <b>
                      Important: These currency & market settings are must for
                      the Qwikcilver App
                    </b>

                    <ol>
                      <li>Store currency has to be INR</li>
                      <li>
                        Market has to be India. In the current version, the App
                        supports only one market at a time.
                      </li>
                      <li>
                        Disable all other markets other than India (In
                        Settingss=&gt Markets)
                      </li>
                      <li>
                        Disable Other Country Customers paying in Local Currency
                        (in Settings=&gt; Markets =&gt; Preferences =&gt;Pricing
                        =&gt; Local Currencies)
                      </li>
                      <li>
                        Timezone has to be GMT+5:30 (Chennai, Kolkata, Mumbai,
                        New Delhi)
                      </li>
                    </ol>
                  </td>
                </tr>
                <tr>
                  <td>Step 2</td>
                  <td>Create & Apply Gift Card SKU Template</td>
                  <td>
                    In Shopify UI Customiser & In Qwikcilver App Dashboard
                  </td>
                  <td>
                    Please ensure you have an image with ratio (width x height)
                    600x250 px to create the gift card SKU
                  </td>
                </tr>
                <tr>
                  <td>Step 3</td>
                  <td>Add-to-Wallet & Wallet Transaction Screens</td>
                  <td>In Shopify UI Customiser</td>
                  <td>
                    Please ensure you have a test account for your website
                    store-front
                  </td>
                </tr>
                <tr>
                  <td>Step 4</td>
                  <td>Add Checkout Extension</td>
                  <td>In Shopify UI Customiser</td>
                  <td>
                    This feature is available only for Shopify Plus Merchants
                  </td>
                </tr>
              </table>
            </div>
          )}
        </div>

        <div className="faq-sections">
          <div
            onClick={handleActive}
            id="purchase"
            className="faq-section__title"
          >
            PURCHASE AND REDEMPTION OF GIFT CARDS{" "}
            <BiChevronDown
              className={`faq-section__icon ${
                activeSection?.purchase ? "icon_up" : ""
              }`}
            />
          </div>
          {activeSection?.purchase && (
            <ol>
              <li>
                <p>How can my customers see gift cards on my online store?</p>
                <p>
                  Once your Gift Card SKU is active on the Shopify dashboard,
                  your customers can easily search and discover the gift card
                  SKU. However, to aid the discovery of your gift card SKU,
                  please add the same to your product navigation menu. Our
                  merchants get higher gift card sales, on promoting the product
                  through site banners and special pages.
                </p>
              </li>
              <li>
                <p>
                  What are the different ways in which my customer can purchase
                  the gift cards?
                </p>
                <p>
                  Customers have the following two options to purchase the gift
                  cards:
                </p>
                <ol type="1">
                  <li>
                    Buy-for-Self: Customers who want to use gift cards for
                    self-consumption on the merchant store, can use this option.
                    Purchasing a gift card using this option will automatically
                    add the gift card, to an online wallet, that Qwikcilver
                    maintains on behalf of the merchant. All gift cards in the
                    customer’s online wallet can be redeemed as part of the
                    Shopify Check-Out flow.
                  </li>
                  <li>
                    Send-As-A-Gift: Customers who want to send the gift cards to
                    friends and family can use this option. Here the customer
                    must enter the recipient’s email details, and the gift card
                    is securely delivered to the recipient via email.
                  </li>
                </ol>
              </li>
              <li>
                <p>
                  What is the Add-to-Balance functionality for the gift cards
                  send by email?
                </p>
                <p>
                  To ensure greater security and convenience for your customers,
                  the Qwikcilver app creates a secure gift card wallet for your
                  customers to store gift cards received from family, friends
                  and other entities (i.e. Employers, Corporate Promotions etc).
                  Customers can simply add the Gift Card Code, received on email
                  to get the gift card added to the wallet.
                </p>
              </li>
              <li>
                <p>
                  How can my customers redeem the gift cards purchased from my
                  online store?
                </p>
                <p>
                  The gift card redemption on your online store would work as
                  follows:
                </p>
                <p>A. For Merchants on the Shopify Plus Plan:</p>
                <ol type="I">
                  <li>
                    Customers have to first login to their account (i.e.
                    merchant website).
                  </li>
                  <li>
                    On successful login, the Qwikcilver app displays the
                    available balance mapped to the customer’s gift card wallet.
                  </li>
                  <li>
                    The Customer can Apply this gift card balance, as part of
                    the Shopify check-out flow
                  </li>
                </ol>
                <p>B. For Merchants on the Shopify Basic Plans:</p>
                <ol type="I">
                  <li>
                    Customers have to first login to their account (i.e.
                    merchant website).
                  </li>
                  <li>
                    On successful login, the Qwikcilver app displays the
                    available balance mapped to the customer’s gift card wallet.
                  </li>
                  <li>
                    From this screen, the Customer can Copy the Gift Balance
                    Code, and paste the same on the Shopify check-out page
                  </li>
                </ol>
              </li>
              <li>
                <p>
                  Can my customers redeem these gift cards at my offline stores
                  (i.e. retail store points)?
                </p>
                <p>
                  The gift cards &amp; store credits issued by the Qwikcilver
                  app can be seamlessly accepted at retail checkout; ONLY if
                  your offline stores (retail store points) are using the
                  Shopify POS system.
                </p>
                <p>
                  For merchants using a different POS application, Qwikcilver is
                  currently working on enabling the gift cards &amp; e-refunds
                  as part of retail check-out. Please drop us a mail at
                  <a href="mailto:care@qwikcilver.com">care@qwikcilver.com</a>,
                  and we will keep you posted as soon as this feature is made
                  available on the Qwikcilver app.
                </p>
              </li>
            </ol>
          )}
        </div>

        <div className="faq-sections">
          <div
            onClick={handleActive}
            id="storecredits"
            className="faq-section__title"
          >
            CREATING STORE CREDITS
            <BiChevronDown
              className={`faq-section__icon ${
                activeSection?.storecredits ? "icon_up" : ""
              }`}
            />
          </div>

          {activeSection.storecredits && (
            <ol>
              <li>
                <p>
                  How can I create store-credits OR e-refunds using the
                  Qwikcilver App?
                </p>
                <p>
                  Please follow the step-by-step actions mentioned below to
                  start generating store credits for your customers:
                </p>
                <ol type="1">
                  <li>
                    Please login to the Qwikcilver App through your Shopify
                    Account.
                  </li>
                  <li>
                    Thereafter select Store Credits from the left navigation
                    menu.
                  </li>
                  <li>
                    This page will list all the orders eligible for refunds, as
                    fetched from your Shopify dashboard.
                  </li>
                  <li>
                    Select the order that you want to refund, and click the
                    proceed button.
                  </li>
                  <li>
                    After you input the refund amount, and confirm, the
                    Qwikcilver app will instantly generate the e-refund for the
                    customer, and map the amount to his/her online store
                    account.
                  </li>
                  <li>
                    The customer will be able to use this e-refund after login
                    to his/her online store account.
                  </li>
                </ol>
              </li>
              <li>
                <p>
                  Can I use the Qwikcilver refunds dashboard for processing
                  refunds back-to-source (i.e. back to the original payment
                  instrument)?
                </p>
                <p>
                  Yes, the Qwikcilver dashboard can be used for initiating
                  refunds back-to-source. In the refund confirmation screen,
                  please select back-to-source from the drop-down options.
                </p>
                <p>
                  On confirming the Back-to-source option, you will be
                  redirected to the Shopify Refunds page, where the action can
                  be completed. Please note that this action is completed by
                  Shopify through the Payment Gateway integrated on your
                  website. Qwikcilver plays no role in crediting a
                  back-to-source refund, and you will need to check with your
                  payment gateway for any details regarding these transactions.
                </p>
              </li>
            </ol>
          )}
        </div>

        <div className="faq-sections">
          <div
            onClick={handleActive}
            id="report"
            className="faq-section__title"
          >
            MERCHANT REPORTS{" "}
            <BiChevronDown
              className={`faq-section__icon ${
                activeSection?.report ? "icon_up" : ""
              }`}
            />
          </div>
          {activeSection?.report && (
            <ol>
              <li>
                <p>
                  How can I track the gift cards and e-refunds (store-credits)
                  issued through the Qwikcilver App?
                </p>
                <p>
                  The Qwikcilver app sends a daily report for merchants
                  detailing the gift cards that are activated and redeemed.
                </p>
              </li>
              <li>
                <p>
                  Will I be able to see the unspent / unused balances at a card
                  level?
                </p>
                <p>
                  Yes, Qwikcilver’s detailed transaction report will help you on
                  this aspect.
                </p>
              </li>
            </ol>
          )}
        </div>

        <div className="faq-sections">
          <div
            onClick={handleActive}
            id="billing"
            className="faq-section__title"
          >
            BILLING{" "}
            <BiChevronDown
              className={`faq-section__icon ${
                activeSection?.billing ? "icon_up" : ""
              }`}
            />
          </div>
          {activeSection?.billing && (
            <ol>
              <li>
                <p>What is the billing cycle for a merchant?</p>
                <p>
                  A merchant that is onboarded during the middle of the month is
                  billed on a pro-rata basis. Thereafter the merchant is billed
                  in calendar month cycles.
                </p>
              </li>
              <li>
                <p>How does my subscription plan work?</p>
                <p>
                  Qwikcilver has a very transparent pricing plan that allows
                  merchants to issue gift cards & store-credits for their
                  customers:
                </p>
                <p>
                  Each subscription plan (for example: Basic Plan of Rs.
                  399+GST) allows the merchant to issue gift cards up-to a
                  certain limit (for example: Rs. 20,000).
                </p>
              </li>
              <li>
                <p>
                  What are the feature differences across the Basic, Pro, and
                  Premium Plans?
                </p>
                <p>
                  The feature differences across the plans are detailed on the
                  App Pricing Page.
                </p>
              </li>
              <li>
                <p>How can I upgrade my current subscription plan?</p>
                <p>
                  A merchant can upgrade the Subscription plan from the
                  Qwikcilver App dashboard. Please select the desired plan and
                  make the payment, and you will be upgraded immediately.
                </p>
              </li>
              <li>
                <p>How can I downgrade my current subscription plan?</p>
                <p>
                  A merchant can downgrade the Subscription plan by sending an
                  email to{" "}
                  <a href="mailto:care@qwikcilver.com">care@qwikcilver.com</a>.
                  Please share your Shopify ID for easy tracking and resolution
                  of your request.
                </p>
              </li>
              <li>
                <p>How can I cancel my subscription plan?</p>
                <p>
                  [To be finalised] In the event where a merchant wants to
                  discontinue using the Qwikcilver App, the merchant can cancel
                  the subscription from the Qwikcilver App dashboard.
                </p>
              </li>
              <li>
                <p>When will the cancellation come into effect?</p>
                <p>
                  Cancel of Subscription always comes to effect from the
                  subsequent month onwards.
                </p>
              </li>
              <li>
                <p>
                  What are the implications of uninstalling the Qwikcilver app
                  from the Shopify account?
                </p>
                <p>
                  Uninstalling the Qwikcilver app will prevent your legitimate
                  customers from redeeming their gift card on your online store.
                  In case you want to discontinue using the Qwikcilver app, you
                  can cancel the subscription plan from the app dashboard.
                </p>
              </li>
            </ol>
          )}
        </div>

        <div className="faq-sections">
          <div
            onClick={handleActive}
            id="support"
            className="faq-section__title"
          >
            CUSTOMER SUPPORT
            <BiChevronDown
              className={`faq-section__icon ${
                activeSection?.support ? "icon_up" : ""
              }`}
            />
          </div>
          {activeSection?.support && (
            <ol>
              <li>
                <p>Does Qwikcilver provide Customer Support?</p>
                <p>
                  Qwikcilver provides a Service dashboard (called Support
                  Central), where merchants can raise support tickets for
                  blocking gift cards, unblocking gift cards, and extending
                  expiry of issued cards, etc. These support tickets are
                  resolved as quickly as possible by Qwikcilver, to avoid
                  business disruptions for the merchants.
                </p>
              </li>
              <li>
                <p>
                  How can I resolve any issues related to the Qwikcilver app
                  integration with my website?
                </p>
                <p>
                  Qwikcilver’s Support Central dashboard also has a dedicated
                  section to help merchants raise requests for any
                  integration-related issues. You can also reach us on{" "}
                  <a href="mailto:care@qwikcilver.com">care@qwikcilver.com</a>
                  with your issue, and we will resolve it at the earliest.
                </p>
              </li>
            </ol>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
