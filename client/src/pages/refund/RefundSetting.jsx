import React, { useEffect, useState } from "react";
import "./styles/RefundSetting.css";
import { PrimaryBtn } from "../../components/BasicComponents";
import instance from "../../axios";
import { getUserToken } from "../../utils/userAuthenticate";
import Spinner from "../../components/Loaders/Spinner";
import { createPortal } from "react-dom";
import CustomDropdown from "../../components/CustomDropdown";

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
      console.log("hit", res);
      const resData = res.data;
      setConfiguration(resData.data);
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
    if (
      configuration.restock_type === "return" &&
      configuration.location_id.length <= 0
    ) {
      alert("Please Enter Location Id!");
    } else {
      setIsLoading(true);
      const url = "/refund/updateSetting";
      const headers = {
        Authorization: getUserToken(),
      };
      const body = {
        prepaid: configuration.prepaid,
        cod: configuration.cod,
        giftCard: configuration.giftCard,
        giftcard_cash: configuration.giftcard_cash,
        location_id: configuration?.location_id
          ? configuration?.location_id
          : "",
        restock_type: configuration?.restock_type
          ? configuration?.restock_type
          : "no_restock",
      };

      let res = null;

      try {
        res = await instance.put(url, body, { headers });
        console.log(res);
        alert("Updated successfully");
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
    }
  };

  return (
    // configuration && (
    <div className="refund-setting__component component">
      {isLoading &&
        createPortal(<Spinner />, document.getElementById("portal"))}
      <div className="component-primary-heading">Store Credit Preferences</div>
      This settings allows you to credit the refund to a store credit.
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
          <div className="refund-setting__headings">Refund to Store-Credit</div>
          <div className="refund-setting__headings">Refund Back-to-Source</div>
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
            checked={configuration?.prepaid?.toLowerCase() === "back-to-source"}
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
            checked={configuration?.cod?.toLowerCase() === "store-credit"}
          />
          <input
            type="checkbox"
            className="refund-setting__radio"
            name="cod"
            value={"Back-to-Source"}
            onChange={handleChange}
            checked={configuration?.cod?.toLowerCase() === "back-to-source"}
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
            checked={configuration?.giftCard?.toLowerCase() === "store-credit"}
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
              configuration?.giftcard_cash?.toLowerCase() === "store-credit"
            }
          />
          <input
            type="checkbox"
            className="refund-setting__radio"
            name="giftcard_cash"
            value={"Back-to-Source"}
            onChange={handleChange}
            checked={
              configuration?.giftcard_cash?.toLowerCase() === "back-to-source"
            }
          />
        </div>

        {/* restock type */}
        <br />

        <div className="refund-setting__options refund-setting__table-grid">
          <div className="refund-setting__type-name">Restock Type</div>
          <div className="refund-setting__restock-input">
            <CustomDropdown
              options={[
                { title: "Return", value: "return" },
                { title: "No Restock", value: "no_restock" },
              ]}
              keyField={"restock_type"}
              value={configuration?.restock_type || "Select"}
              setvalue={setConfiguration}
            />
          </div>

          <div></div>
        </div>
        {configuration?.restock_type === "return" ? (
          <div className="refund-setting__options refund-setting__table-grid">
            <div className="refund-setting__type-name">Location ID</div>
            <div className="refund-setting__restock-input">
              <input
                className="refund-setting__location-input"
                type="text"
                value={configuration?.location_id || ""}
                onWheel={(e) => e.target.blur()}
                onChange={(e) => {
                  const val = e.target.value;

                  if (/^\d*\d*$/.test(val))
                    setConfiguration((prev) => ({
                      ...prev,
                      location_id: e.target.value,
                    }));
                }}
              />
            </div>
            <div></div>
          </div>
        ) : (
          ""
        )}

        <PrimaryBtn $primary onClick={handleUpdate}>
          Save
        </PrimaryBtn>
      </div>
    </div>
  );
  // );
};

export default RefundSetting;
