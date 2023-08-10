import React from "react";
import BarLoading from "./BarLoading";

const LoaderComponent = () => {
  return (
    <div
      className="loader-component"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "80vh",
      }}
    >
      <BarLoading />
    </div>
  );
};

export default LoaderComponent;
