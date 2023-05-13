import React from "react";
import styles from "./AccDetails.module.scss";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { getAuth, signOut } from "firebase/auth";
import { createAlert } from "../../../store/slices/alert-slice";
import { useNavigate } from "react-router";
import { removeUser } from "../../../store/slices/user-slice";
import UPhoto from "./UPhoto";

const AccDetails = () => {
  const userName = useAppSelector((state) => state.user.uName);
  const password = useAppSelector((state) => state.user.password);
  const userEmail = useAppSelector((state) => state.user.email);
  const userID = useAppSelector((state) => state.user.id);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleSignOutCLick() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatch(
          createAlert({
            alertTitle: "Success!",
            alertText: "You successfully sign out!",
            alertError: false,
          })
        );
        navigate("/");
        dispatch(removeUser());
        window.location.reload();
      })
      .catch((error) => {
        dispatch(
          createAlert({
            alertTitle: "Error!",
            alertText: "Sign out failed, database error",
            alertError: true,
          })
        );
      });
  }

  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <div className={styles["acc-details"]}>
      <span>Username:</span>
      <div>{userName}</div>
      <span>Password:</span>
      <div> {password}</div>
      <span>Email:</span>
      <div>{userEmail}</div>
      <span>User id:</span>
      <div>{userID}</div>
      <div className={styles["acc-details__avatar"]}>
        <UPhoto />
      </div>
      <button
        sign-out-theme={theme}
        className={styles["acc-details__sign-out-btn"]}
        onClick={handleSignOutCLick}
      >
        Sign Out
      </button>
    </div>
  );
};

export default AccDetails;
