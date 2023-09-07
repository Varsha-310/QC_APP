import useScrollTop from "../../hooks/useScrollTop";
import "./styles/Issues.css";
const Issues = () => {
  useScrollTop();
  return (
    <div className="issues-container component">
      <div className="component-primary-heading">Have an Issue?</div>
      <div className="section-box-container">
        <p>
          Please use Qwikcilver’s Support Dashboard to raise any Issues you are
          facing.
        </p>
        <p>
          To Access the dashboard, <a href="">Click Here.</a>
        </p>
      </div>
    </div>
  );
};

export default Issues;
