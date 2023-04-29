import React from "react";
import styles from "./Ticker.module.scss";
import { useAppSelector } from "../../../hooks/redux";

const Ticker = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <div ticker-theme={theme} className={styles["ticker__wrapper"]}>
      <div className={styles["ticker"]}>
        <div className={styles["ticker__items"]}>
          <div className={styles["ticker__item"]}>
            Changes will not be saved, you need to have an account!
          </div>
          <div className={styles["ticker__item"]}>
            Changes will not be saved, you need to have an account!
          </div>
          <div className={styles["ticker__item"]}>
            Changes will not be saved, you need to have an account!
          </div>
        </div>
        <div className={styles["ticker__items"]}>
          <div className={styles["ticker__item"]}>
            Changes will not be saved, you need to have an account!
          </div>
          <div className={styles["ticker__item"]}>
            Changes will not be saved, you need to have an account!
          </div>
          <div className={styles["ticker__item"]}>
            Changes will not be saved, you need to have an account!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticker;
