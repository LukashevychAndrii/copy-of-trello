import React from "react";
import styles from "./Error.module.scss";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";
import MainHeader from "../Header/MainHeader";
import Footer from "../Footer/Footer";

const Error = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <>
      <div>
        <MainHeader />
      </div>
      <div
        error-theme={theme}
        data-theme={theme}
        className={styles["error-container__wrapper"]}
      >
        <div className={styles["error-container"]}>
          <div className={styles["error-container__title"]}>
            An Error Occured!
          </div>
          <div className={styles["error-container__text"]}>
            This page is not supported
          </div>
          <Link
            className={styles["error-container__link"]}
            to="/copy-of-trello"
          >
            Back to Boards Page
          </Link>
        </div>
        <div className={styles["error-container__footer"]}>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Error;
