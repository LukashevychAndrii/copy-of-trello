import React from "react";
import styles from "./AccDetails.module.scss";
import { useAppSelector } from "../../../hooks/redux";

const AccDetails = () => {
  const userName = useAppSelector((state) => state.user.uName);
  const password = useAppSelector((state) => state.user.password);
  const userEmail = useAppSelector((state) => state.user.email);

  return (
    <div className={styles["acc-details"]}>
      <span>Username:</span>
      <div>{userName}</div>
      <span>Password:</span>
      <div> {password}</div>
      <span>Email:</span>
      <div>{userEmail}</div>
    </div>
  );
};

export default AccDetails;
