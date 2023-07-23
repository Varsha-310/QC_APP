import { Link } from "react-router-dom";
import "./styles/Footer.css";

const Footer = () => {
  return (
    <div className="app-footer">
      <Link to={"privacy-policy"} className="app-footer__items">
        Privacy and Policy
      </Link>
      <Link to={"terms-conditions"} className="app-footer__items">
        Terms and Conditions
      </Link>
      <Link to={"faq"} className="app-footer__items">
        FAQ
      </Link>
      <span className="app-footer__items">Copyright &copy; 2023</span>
    </div>
  );
};

export default Footer;
