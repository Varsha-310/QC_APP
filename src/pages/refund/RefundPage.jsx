import React from "react";
import "./styles/RefundPage.css";
import { useParams } from "react-router";
import { Dot, PrimaryBtn } from "../../components/BasicComponents";
import CustomDropdown from "../../components/CustomDropdown";

const RefundPage = () => {
  const { id } = useParams();
  return (
    <div className="refund-page__component component">
      <div className="section-box-container">
        <div className="section-box-title bold">
          Refunding Order No: {id} Orders Via Gift Card
        </div>
      </div>

      <div className="section-box-container main-component">
        {/* select product */}
        <div className="refund-page__select-item">
          <div className="refund-page__title">Select Product : </div>
          <div className="refund-page__drop-container">
            <CustomDropdown options={["item1", "item2", "item3", "item4"]} />
          </div>
        </div>

        <div className="refund-page__refund-item-data">
          {/* refund details */}
          <div className="refund-page__details">
            <div className="refund-page__refund-process">
              <div className="refund-page__title">Multivitamin & Mineral</div>
              <div className="refund-page__refund-status">
                <ul>
                  <li className="refund-page__refund-status-item">
                    <Dot size="6px" fill={true} />
                    <span className="refund-page__refund-status-label">
                      Return Reason
                    </span>
                  </li>
                  <li className="refund-page__refund-status-item">
                    <Dot size="6px" fill={false} />
                    <span className="refund-page__refund-status-label">
                      Refunded
                    </span>
                  </li>
                  <li className="refund-page__refund-status-item">
                    <Dot size="6px" fill={false} />
                    <span className="refund-page__refund-status-label">
                      Restocked at
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="refund-page__refund-shipping">
              <div className="refund-page__shipping-rate">
                <div className="refund-page__title">Refund Shipping</div>
                <div className="refund-page__text_bold">
                  Shipping rate : Standard (₹50.00)
                </div>
                <input
                  type="number"
                  placeholder="Enter Amount"
                  className="refund-page__shipping-rate-input"
                />
              </div>
            </div>
          </div>

          {/* refund quantity */}
          <div className="refund-page__quantity">
            <div className="refund-page__title">₹500.00 x 2</div>
          </div>

          {/* refund summary */}
          <div className="refund-page__summary">
            <div className="refund-page__refund-process">
              <div className="refund-page__title">Sumamary</div>

              {/* total price estimation */}

              <table className="refund-page__price-summary-table">
                <tr>
                  <td>Item Subtotal</td>
                  <td>₹1000</td>
                </tr>
                {/* <tr>
                  <td>1 Items</td>
                  <td></td>
                </tr> */}
                <tr>
                  <td>Tax</td>
                  <td>₹500</td>
                </tr>
                <tr>
                  <td>Shipping</td>
                  <td>₹00</td>
                </tr>
                <tr id="total-refund">
                  <td>Refund Total</td>
                  <td>₹1500</td>
                </tr>
              </table>
            </div>

            <div className="refund-page__refund-shipping">
              <div className="refund-page__shipping-rate">
                <div className="refund-page__title">Refund Shipping</div>
                <input
                  type="number"
                  placeholder="Enter Amount"
                  className="refund-page__shipping-rate-input"
                />
                <div className="refund-page__title">
                  Rs. 1000 Available for refund
                </div>

                <PrimaryBtn $primary width="100%">
                  Refund to Store-Credit
                </PrimaryBtn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPage;
