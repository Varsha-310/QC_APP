import "./styles/AccountPage.css";
import { CustomContainer, PrimaryBtn } from "../../components/BasicComponents";
import { SectionHeading1 } from "../../components/BasicComponents";
import PlanCard from "../../components/PlanCard";
import { baseUrl1 } from "../../axios";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AccountPage = () => {
  const [planData, setPlanData] = useState(null);
  const [status, setStatus] = useState(null);

  // get plan and selected plans
  const fetchPlan = async () => {
    const url = baseUrl1 + "/plan/list";
    const headers = {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZV91cmwiOiJtbXR0ZXN0c3RvcmU4Lm15c2hvcGlmeS5jb20iLCJpYXQiOjE2ODc0MjAxMzR9.wR7CCHPBMIbIv9o34E37j2yZSWF1GkKv4qXbROV6vf0",
    };

    try {
      const res = await axios.post(url, {}, { headers });
      setPlanData(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const merchantStatus = async () => {
    const url = baseUrl1 + "/kyc/status";
    const headers = {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZV91cmwiOiJtbXR0ZXN0c3RvcmU4Lm15c2hvcGlmeS5jb20iLCJpYXQiOjE2ODc0MjAxMzR9.wR7CCHPBMIbIv9o34E37j2yZSWF1GkKv4qXbROV6vf0",
    };

    try {
      const res = await axios.post(url, {}, { headers });
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

      <div className="section-box-container">
        <div className="section-box-title">Current Plan</div>
      </div>

      <CustomContainer margin="30px 0px" align="center">
        <PlanCard
          plan={planData?.data.plans.find(
            (item) =>
              item.plan_name.toUpperCase() === planData.data.selectedPlan
          )}
          active={false}
          // popular={}
          btnText={"Upgrade"}
        />
      </CustomContainer>

      <CustomContainer margin="50px 0px">
        <Link to={"/select-plan"} className="account-page__link">
          <PrimaryBtn $primary>View All Plans</PrimaryBtn>
        </Link>
      </CustomContainer>

      <div className="section-box-container">
        <div className="section-box-title">Setttings</div>
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
