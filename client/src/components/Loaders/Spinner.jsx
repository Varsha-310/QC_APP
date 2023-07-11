import "./style/Spinner.css";

const Spinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Spinner;
