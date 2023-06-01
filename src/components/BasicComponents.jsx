import { Link } from "react-router-dom";
import styled from "styled-components";

const BACKGROUND_COLOR = "#f1f3f7";
const SECONDARY_DARK_BTN = "#b62028";
const SECONDARY_LIGHT_BTN = "#ffffff";
const FRAME_COLOR = "#b62028";
const TEXT_REGULAR_COLOR = "#ffffff";
const TEXT_PRIMARY_COLOR = "#B72028";
const TEXT_DARK_COLOR = "#000000";
const TEXT_BOLD_COLOR = "#182560";
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
  cursor: pointer;
  font-weight: ${(props) => props?.weight || "600"};
  color: ${(props) =>
    props.$primary ? TEXT_REGULAR_COLOR : TEXT_PRIMARY_COLOR};
  background-color: ${(props) =>
    props.$primary ? SECONDARY_DARK_BTN : SECONDARY_LIGHT_BTN};
  border: 1px solid
    ${(props) => (props.$primary ? SECONDARY_DARK_BTN : TEXT_PRIMARY_COLOR)};
  border-radius: 10px;
  margin: 0px auto;
`;

const CustomBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px auto;
  border-radius: 8px;
  font-family: "Poppins";
  height: ${(props) => props?.height || "30px"};
  width: ${(props) => props?.width || "85px"};
  font-weight: ${(props) => props?.weight || "600"};
  font-size: ${(props) => props?.size || "14px"};
  line-height: ${(props) => props?.lineheight || "18px"};
  color: ${(props) =>
    props.active ? SECONDARY_LIGHT_BTN : SECONDARY_DARK_BTN};
  background-color: ${(props) => (props?.active ? SECONDARY_DARK_BTN : "")};
  border: 1px solid ${SECONDARY_DARK_BTN};
`;

const RectBtn = styled.div`
  font-family: "Poppins";
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px auto;
  cursor: pointer;
  height: ${(props) => props?.height || "30px"};
  width: ${(props) => props?.width || "85px"};
  font-weight: ${(props) => props?.weight || "600"};
  font-size: ${(props) => props?.size || "14px"};
  line-height: ${(props) => props?.lineheight || "18px"};
  padding: ${(props) => props?.padding || ""};
  color: ${(props) =>
    props.active ? SECONDARY_LIGHT_BTN : SECONDARY_DARK_BTN};
  background-color: ${(props) => (props?.active ? SECONDARY_DARK_BTN : "")};
  border-radius: ${(props) => props?.bdradius || "0px"};
  border: ${(props) => props?.border || `1px solid ${SECONDARY_DARK_BTN}`};
  box-shadow: ${(props) =>
    props?.active && " 0px 5px 10px 3px rgba(0, 0, 0, 0.25)"};
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
  width: 185px;
  color: ${TEXT_DARK_COLOR};
  background-color: #ffffff;
  margin: 15px 0px;
  cursor: pointer;
  text-decoration: none;
  box-shadow: ${(props) =>
    props?.active ? "0px 4px 7px 1px rgba(0, 0, 0, 0.15)" : ""};
`;

const SubTabBox = styled(Link)`
  display: grid;
  grid-template-columns: ${(props) =>
    props?.dropdown ? "1fr 3fr 1fr" : "1fr 4fr"};
  width: 185px;
  text-decoration: none;
  margin: 5px 0px;
  padding: 5px 0px 5px 15px;
  align-items: center;
  // justify-items: center;
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
const TabSubItemLable = styled.div`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  display: flex;
  justify-content: left;
  align-items: center;
  color: ${TEXT_DARK_COLOR};
`;
const NestedTabBox = styled(Link)`
  width: 185px;
  text-decoration: none;
  margin: 10px 0px;
  display: grid;
  grid-template-columns: 1fr 4fr;
  padding: 0px 0px 0px 15px;

  justify-content: center;
`;

const SectionHeading1 = styled.div`
  font-family: "Epilogue";
  font-style: normal;
  width: 100%;
  font-weight: ${(props) => props?.weight};
  font-size: ${(props) => props?.size};
  line-height: ${(props) => props?.lineheight};
  text-align: ${(props) => props?.align};
  margin: ${(props) => props?.margin};
  color: ${TEXT_DARK_COLOR};
`;
const SectionTitle = styled.div`
  font-family: "Poppins";
  font-style: normal;
  width: 100%;
  font-weight: ${(props) => props?.weight};
  font-size: ${(props) => props?.size};
  line-height: ${(props) => props?.lineheight};
  text-align: ${(props) => props?.align};
  color: ${TEXT_BOLD_COLOR};
`;
const SectionPara = styled.p`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--text-dark-color);
  display: flex;
  justify-content: ${(props) => props?.align || "center"};
  margin: ${(props) => props?.margin};
`;

const Dot = styled.div`
  position: relative;
  height: ${(props) => props?.size};
  width: ${(props) => props?.size};
  border-radius: 50px;
  background-color: ${(props) =>
    props?.fill == true ? FRAME_COLOR : "#FFFFFF"};
  border: 1px solid ${FRAME_COLOR};
  margin: 10px;
  z-index: 20;

  // &::after{
  //   content:"";
  //   z-index:-1;

  //   position:absolute;
  //   top: 50%;
  //   left: calc(100%-2px);
  //   transform: translate:(-50%,-50%);
  //   background-color: ${FRAME_COLOR};
  //   width: 200px;
  //   height: 2px;
  // }
`;
export {
  PrimaryBtn,
  TabBox,
  TabItemLable,
  SubTabBox,
  NestedTabBox,
  SectionHeading1,
  Dot,
  SectionTitle,
  TabSubItemLable,
  SectionPara,
  CustomBtn,
  RectBtn,
};
