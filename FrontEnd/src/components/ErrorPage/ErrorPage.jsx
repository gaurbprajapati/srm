import React from "react";
import "./ErrorPage.scss";
import { BsFillArrowLeftSquareFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import DefaultLayout from "../DefaultLayout";
const ErrorPage = () => {
  return (
    <DefaultLayout>
      <div className="error-container">
        <h1>ERROR 404 | PAGE NOT FOUND </h1>
        <Link to="/">
          <div className="home">
            <BsFillArrowLeftSquareFill size="40px" className="icon" />{" "}
            <h1>GO BACK HOME</h1>
          </div>
        </Link>
      </div>
    </DefaultLayout>
  );
};

export default ErrorPage;
