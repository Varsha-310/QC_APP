import React, { useEffect, useState } from "react";
import "./styles/RefundSetting.css";
import { CustomContainer, PrimaryBtn } from "../../components/BasicComponents";
import axios from "axios";
import { baseUrl2 } from "../../axios";

const RefundSetting = () => {
  const [configuration, setConfiguration] = useState();
  console.log(configuration);

  const updateConfig = async () => {
    const url = "https://5cf1-106-51-87-194.ngrok-free.app/refund/getSetting";
    const headers = {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZV91cmwiOiJxd2lja2NpbHZlci1kZXYubXlzaG9waWZ5LmNvbSIsImlhdCI6MTY4NzUxNDE5OH0.ZCdIKEQsc_a0UPOkBmi6n02szucrssXDOW628Yi0cLQ",
    };

    const res = await axios.post(
      url,
      { store_url: "qwickcilver-dev.myshopify.com" },
      { headers }
    );

    const redData = res.data;

    console.log(redData);
    // console.log(redData.message.data.cod)
    setConfiguration(redData.message.data);
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
    const url = baseUrl2 + "/refund/updateSetting";
    const headers = {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZV91cmwiOiJxd2lja2NpbHZlci1kZXYubXlzaG9waWZ5LmNvbSIsImlhdCI6MTY4NzUxNDE5OH0.ZCdIKEQsc_a0UPOkBmi6n02szucrssXDOW628Yi0cLQ",
    };
    const body = {
      store_url: configuration.store_url,
      prepaid: configuration.prepaid,
      cod: configuration.cod,
      giftCard: configuration.giftCard,
      giftcard_cash: configuration.giftcard_cash,
    };

    let res = null;

    try {
      res = await axios.put(url, body, { headers });
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else {
        console.log(error);
      }
    }

    if (res.data.message.code === 200) {
      alert("Updated Successfully!");
    } else {
      alert("Something went");
    }

    console.log(res.data);
  };

  return (
    configuration && (
      <div className="refund-setting__component component">
        <div className="section-box-container">
          <div className="section-box-title">Store Credit Configuration</div>
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
              Refund Back-to-Source
            </div>
            <div className="refund-setting__headings">
              Refund to Store-Credit
            </div>
          </div>

          <div className="refund-setting__options refund-setting__table-grid">
            <div className="refund-setting__type-name">Prepaid</div>
            <input
              type="checkbox"
              className="refund-setting__radio"
              name="prepaid"
              value={"Back-to-Source"}
              onChange={handleChange}
              checked={configuration.prepaid.toLowerCase() === "back-to-source"}
            />
            <input
              type="checkbox"
              className="refund-setting__radio"
              name="prepaid"
              value={"Store-Credit"}
              onChange={handleChange}
              checked={configuration.prepaid.toLowerCase() === "store-credit"}
            />
          </div>
          <div className="refund-setting__options refund-setting__table-grid">
            <div className="refund-setting__type-name">COD</div>
            <input
              type="checkbox"
              className="refund-setting__radio"
              name="cod"
              value={"Back-to-Source"}
              onChange={handleChange}
              checked={configuration.cod.toLowerCase() === "back-to-source"}
            />
            <input
              type="checkbox"
              className="refund-setting__radio"
              name="cod"
              value={"Store-Credit"}
              onChange={handleChange}
              checked={configuration.cod.toLowerCase() === "store-credit"}
            />
          </div>
          <div className="refund-setting__options refund-setting__table-grid">
            <div className="refund-setting__type-name">Gift Card</div>
            <div></div>
            {/* <input type="checkbox" className="refund-setting__radio" /> */}
            <input
              type="checkbox"
              className="refund-setting__radio"
              value={"Store-Credit"}
              name="giftCard"
              onChange={handleChange}
              id="default"
              checked={configuration.giftCard.toLowerCase() === "store-credit"}
            />
          </div>
          <div className="refund-setting__options refund-setting__table-grid">
            <div className="refund-setting__type-name">
              Combination of Prepaid & Gift Card
            </div>
            <input
              type="checkbox"
              className="refund-setting__radio"
              name="giftcard_cash"
              value={"Back-to-Source"}
              onChange={handleChange}
              checked={
                configuration.giftcard_cash.toLowerCase() === "back-to-source"
              }
            />
            <input
              type="checkbox"
              className="refund-setting__radio"
              name="giftcard_cash"
              value={"Store-Credit"}
              onChange={handleChange}
              checked={
                configuration.giftcard_cash.toLowerCase() === "store-credit"
              }
            />
          </div>

          <CustomContainer margin="50px 0px">
            <PrimaryBtn $primary onClick={handleUpdate}>
              Save
            </PrimaryBtn>
          </CustomContainer>
        </div>
      </div>
    )
  );
};

export default RefundSetting;
