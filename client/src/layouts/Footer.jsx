import { Link } from "react-router-dom";
import "./styles/Footer.css";

const Footer = () => {
  return (
    <div className="app-footer">
      <Link to={"privacy-policy"} className="app-footer__items">
        Privacy Policy
      </Link>
      <Link to={"terms-and-conditions"} className="app-footer__items">
        Terms and Conditions
      </Link>
      <span className="app-footer__items">Copyright &copy; 2023</span>
    </div>
  );
};

export default Footer;
