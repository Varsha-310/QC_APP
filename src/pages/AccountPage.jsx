import "./style/AccountPage.css";
import { CustomContainer, PrimaryBtn } from "../components/BasicComponents";
import { SectionHeading1 } from "../components/BasicComponents";
import PlanCard from "../components/PlanCard";

const AccountPage = () => {
  return (
    <div className="account_page-container" style={{ width: "100%" }}>
      <div className="section-box-container">
        <SectionHeading1
          weight="500"
          size="16px"
          align="left"
          lineheight="16px"
        >
          Account
        </SectionHeading1>
      </div>

      <div className="section-box-container">
        <SectionHeading1
          weight="500"
          size="16px"
          align="left"
          lineheight="16px"
        >
          Current Plan
        </SectionHeading1>
      </div>

      <CustomContainer margin="30px 0px" align="center">
        <PlanCard
          title={"Pro"}
          price={799}
          active={true}
          popular={true}
          btnText={"Upgrade"}
        />
      </CustomContainer>

      <CustomContainer margin="50px 0px">
        <PrimaryBtn $primary>View All Plans</PrimaryBtn>
      </CustomContainer>

      <div className="section-box-container">
        <SectionHeading1
          weight="500"
          size="16px"
          align="left"
          lineheight="16px"
        >
          Settings
        </SectionHeading1>
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
