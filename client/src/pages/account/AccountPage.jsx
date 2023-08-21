import "./styles/AccountPage.css";
import { CustomContainer, PrimaryBtn } from "../../components/BasicComponents";
import { SectionHeading1 } from "../../components/BasicComponents";
import PlanCard from "../../components/PlanCard";
import instance from "../../axios";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserToken } from "../../utils/userAuthenticate";

const AccountPage = () => {
  const [planData, setPlanData] = useState(null);
  const [status, setStatus] = useState(null);

  // get plan and selected plans
  const fetchPlan = async () => {
    const url = "/plan/list";
    const headers = {
      Authorization: getUserToken(),
    };

    try {
      const res = await instance.post(url, {}, { headers });
      setPlanData(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const merchantStatus = async () => {
    const url = "/kyc/status";
    const headers = {
      Authorization: getUserToken(),
    };

    try {
      const res = await instance.post(url, {}, { headers });
      setStatus(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPlan();
    merchantStatus();
  }, []);

  return (
    <div className="account_page-container" style={{ width: "100%" }}>
      <div className="section-box-container">
        <div className="section-box-title">My Plan</div>
      </div>

      <CustomContainer margin="30px 0px" align="center">
        {planData?.data?.plans ? (
          planData.data.selectedPlan !== "" ? (
            <PlanCard
              plan={planData?.data?.plans.find(
                (item) =>
                  item.plan_name.toLowerCase() ===
                  planData.data.selectedPlan.toLowerCase()
              )}
              active={false}
              // popular={}
              btnText={""}
            />
          ) : (
            "No Active Plan"
          )
        ) : (
          ""
        )}
      </CustomContainer>

      <CustomContainer margin="50px 0px">
        <Link to={"/select-plan"} className="account-page__link">
          <PrimaryBtn $primary>Upgrade Plan</PrimaryBtn>
        </Link>
      </CustomContainer>

      <div className="section-box-container">
        <div className="section-box-title-regular">Store Contact</div>
      </div>

      <div className="section-box-container">
        <div className="contact-input">
          <SectionHeading1
            weight="500"
            size="16px"
            align="left"
            lineheight="16px"
          >
            Store Name
          </SectionHeading1>
          <div type="text" className="account-page__store-detail ">
            {status?.data?.name}
          </div>
        </div>

        <div className="contact-input">
          <SectionHeading1
            weight="500"
            size="16px"
            align="left"
            lineheight="16px"
          >
            Contact Email
          </SectionHeading1>
          <div type="text" className="account-page__store-detail ">
            {status?.data?.email}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
