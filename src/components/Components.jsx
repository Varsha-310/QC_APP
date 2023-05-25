import { Link } from "react-router-dom";
import styled from "styled-components";

const BACKGROUND_COLOR = "#f1f3f7";
const SECONDARY_DARK_BTN = "#b62028";
const SECONDARY_LIGHT_BTN = "#ffffff";
const FRAME_COLOR = "#b62028";
const TEXT_REGULAR_COLOR = "#ffffff";
const TEXT_PRIMARY_COLOR = "#B72028";
const TEXT_DARK_COLOR = "#000000";
const RATING_COLOR = "#fec600";

const PrimaryBtn = styled.div`
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  line-height: 21px;
  width: 180px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: ${(props) => props?.weight || "600"};
  color: ${(props) =>
    props.$primary ? TEXT_REGULAR_COLOR : TEXT_PRIMARY_COLOR};
  background-color: ${(props) =>
    props.$primary ? SECONDARY_DARK_BTN : SECONDARY_LIGHT_BTN};
  border: 1px solid
    ${(props) => (props.$primary ? SECONDARY_DARK_BTN : TEXT_PRIMARY_COLOR)};
  border-radius: 10px;
`;

const TabBox = styled(Link)`
  font-family: "Poppins", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  line-height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 35px;
  width: 175px;
  max-width: 185px; 
  color: ${TEXT_DARK_COLOR};
  background-color: #FFFFFF;
  margin-bottom: 15px;
  cursor:pointer;
  text-decoration:none;
  box-shadow: ${(props) =>
    props?.active ? "0px 4px 7px 1px rgba(0, 0, 0, 0.15)" : ""};
`;
 
const TabItemLable = styled.div`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
  color: ${TEXT_DARK_COLOR};
`;
export { PrimaryBtn, TabBox,TabItemLable };
