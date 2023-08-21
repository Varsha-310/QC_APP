import React from "react";
import "./index.css";
import { Link, redirect, useNavigate } from "react-router-dom";
import { TbFaceIdError } from "react-icons/tb";
import { PrimaryBtn } from "../components/BasicComponents";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div className="error-page component">
      <TbFaceIdError className="error-icon" />
      <p className="error-page__msg">
        The page you’re looking for could not be found.
      </p>

      <div>
        <PrimaryBtn
          $primary
          onClick={() => navigate("/home", { replace: true })}
        >
          Back to Home
        </PrimaryBtn>
      </div>
    </div>
  );
};

export default ErrorPage;
