import React, { useEffect, useState } from "react";
import "./styles/RefundSetting.css";
import { PrimaryBtn } from "../../components/BasicComponents";
import axios from "axios";
import instance from "../../axios";
import { getUserToken } from "../../utils/userAuthenticate";
import Spinner from "../../components/Loaders/Spinner";
import { createPortal } from "react-dom";

const RefundSetting = () => {
  const [configuration, setConfiguration] = useState();
  const [isLoading, setIsLoading] = useState(false);

  console.log(configuration);

  const updateConfig = async () => {
    setIsLoading(true);
    const url = "/refund/getSetting";
    const headers = {
      Authorization: getUserToken(),
    };
    try {
      const res = await instance.get(url, { headers });
      const resData = res.data;

      setConfiguration(resData.data);
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updateConfig();
  }, []);

  // handle field change
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setConfiguration((prev) => ({ ...prev, [name]: value }));
  };

  // update configuration
  const handleUpdate = async (event) => {
    setIsLoading(true);
    const url = "/refund/updateSetting";
    const headers = {
      Authorization: getUserToken(),
    };
    const body = {
      location_id: configuration.location_id,
      prepaid: configuration.prepaid,
      cod: configuration.cod,
      giftCard: configuration.giftCard,
      giftcard_cash: "Store-credit",
      restock_type: configuration.restock_type,
    };

    let res = null;

    try {
      res = await instance.put(url, body, { headers });

      alert(res?.data?.message);
      console.log(res);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else {
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }

    // if (res.data.message === 200) {
    //   alert("Updated Successfully!");
    // } else {
    //   alert("Something went");
    // }

    console.log(res.data);
  };

  return (
    configuration && (
      <div className="refund-setting__component component">
        {isLoading &&
          createPortal(<Spinner />, document.getElementById("portal"))}

        <div className="section-box-container">
          <div className="section-box-title">Store Credit Preferences</div>
          <div className="section-box-subtitle">
            This settings allows you to credit the refund to a store credit.
          </div>
        </div>

        <div className="section-box-container">
          <div className="refund-setting__title">
            What is the desired action? Select as Applicable
          </div>
        </div>

        <div className="section-box-container">
          <div className="refund-setting__header refund-setting__table-grid">
            <div className="refund-setting__headings">
              Payment Mode of Returned Order
            </div>
            <div className="refund-setting__headings">
              Refund to Store-Credit
            </div>
            <div className="refund-setting__headings">
              Refund Back-to-Source
            </div>
          </div>

          <div className="refund-setting__options refund-setting__table-grid">
            <div className="refund-setting__type-name">
              Prepaid (CC / DC / UPI / Net Banking)
            </div>
            <input
              type="checkbox"
              className="refund-setting__radio"
              name="prepaid"
              value={"Store-Credit"}
              onChange={handleChange}
              checked={configuration?.prepaid?.toLowerCase() === "store-credit"}
            />
            <input
              type="checkbox"
              className="refund-setting__radio"
              name="prepaid"
              value={"Back-to-Source"}
              onChange={handleChange}
              checked={
                configuration?.prepaid?.toLowerCase() === "back-to-source"
              }
            />
          </div>
          <div className="refund-setting__options refund-setting__table-grid">
            <div className="refund-setting__type-name">Cash On Delivery</div>

            <input
              type="checkbox"
              className="refund-setting__radio"
              name="cod"
              value={"Store-Credit"}
              onChange={handleChange}
              checked={configuration.cod.toLowerCase() === "store-credit"}
            />
            <input
              type="checkbox"
              className="refund-setting__radio"
              name="cod"
              value={"Back-to-Source"}
              onChange={handleChange}
              checked={configuration.cod.toLowerCase() === "back-to-source"}
            />
          </div>
          <div className="refund-setting__options refund-setting__table-grid">
            <div className="refund-setting__type-name">Gift Card</div>

            {/* <input type="checkbox" className="refund-setting__radio" /> */}
            <input
              type="checkbox"
              className="refund-setting__radio"
              value={"Store-Credit"}
              name="giftCard"
              onChange={handleChange}
              // id="default"
              checked={configuration.giftCard?.toLowerCase() === "store-credit"}
            />
            <div></div>
          </div>
          <div className="refund-setting__options refund-setting__table-grid">
            <div className="refund-setting__type-name">
              Combination of Prepaid & Gift Card
            </div>

            <input
              type="checkbox"
              className="refund-setting__radio"
              name="giftcard_cash"
              value={"Store-Credit"}
              onChange={handleChange}
              checked={
                configuration.giftcard_cash?.toLowerCase() === "store-credit"
              }
            />
            <input
              type="checkbox"
              className="refund-setting__radio"
              name="giftcard_cash"
              value={"Back-to-Source"}
              onChange={handleChange}
              checked={
                configuration.giftcard_cash?.toLowerCase() === "back-to-source"
              }
            />
          </div>

          {/* <CustomContainer margin="50px 0px"> */}
          <PrimaryBtn $primary onClick={handleUpdate}>
            Save
          </PrimaryBtn>
          {/* </CustomContainer> */}
        </div>
      </div>
    )
  );
};

export default RefundSetting;
