import "./styles/AccountPage.css";
import { CustomContainer, PrimaryBtn } from "../../components/BasicComponents";
import { SectionHeading1 } from "../../components/BasicComponents";
import PlanCard from "../../components/PlanCard";
import { baseUrl1 } from "../../axios";
import axios from "axios";
import { useEffect, useState } from "react";

const AccountPage = () => {
  const [planData, setPlanData] = useState(null);

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

  useEffect(() => {
    fetchPlan();
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
        {
          
        }
        {/* <PlanCard
          plan={planData.data}
          active={false}
          popular={true}
          btnText={"Upgrade"}
        /> */}
      </CustomContainer>

      <CustomContainer margin="50px 0px">
        <PrimaryBtn $primary>View All Plans</PrimaryBtn>
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
          <input type="text" />
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
          <input type="text" />
        </div>
      </div>

      <CustomContainer margin="50px 0px">
        <PrimaryBtn $primary>Save</PrimaryBtn>
      </CustomContainer>
    </div>
  );
};

export default AccountPage;
