import React from "react";
import styles from "./MainHeader.module.scss";

import defaultAvatar from "../../img/default-avatar--white.png";

import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";

const getStyle = ({ isActive }: { isActive: boolean }) =>
  isActive ? styles["header--active"] : "";

const MainHeader = () => {
  const userPhoto = useAppSelector((state) => state.user.uPhoto);
  const userName = useAppSelector((state) => state.user.uName);

  return (
    <header className={styles["header"]}>
      <NavLink className={getStyle} to="/">
        Boards
      </NavLink>
      {userName ? (
        <NavLink className={getStyle} to="acc-details">
          <div className={styles["header__acc"]}>
            <img
              className={styles["header__user-photo"]}
              src={userPhoto ? userPhoto : defaultAvatar}
              alt="user"
            />
            <span className={styles["header__user-name"]}>{userName}</span>
          </div>
        </NavLink>
      ) : (
        <div className={styles["header__auth-nav"]}>
          <NavLink className={getStyle} to="sign-in">
            Sign In
          </NavLink>
          <NavLink className={getStyle} to="sign-up">
            Sign Up
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default MainHeader;
