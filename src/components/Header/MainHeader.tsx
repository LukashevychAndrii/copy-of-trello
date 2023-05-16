import React from "react";
import styles from "./MainHeader.module.scss";

import defaultAvatarWhite from "../../img/default-avatar--white.png";
import defaultAvatarBlack from "../../img/default-avatar--black.png";

import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";
import ThemeToggleBtn from "./ThemeToggleBtn/ThemeToggleBtn";
import NotificationIcon from "./Notification/NotificationIcon";

const getStyle = ({ isActive }: { isActive: boolean }) =>
  isActive ? styles["header--active"] : "";

const MainHeader = () => {
  const userPhoto = useAppSelector((state) => state.user.uPhoto);
  const userName = useAppSelector((state) => state.user.uName);

  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <header data-theme={`${theme}`} className={styles["header"]}>
      <NavLink className={getStyle} to="/copy-of-trello">
        Boards
      </NavLink>
      {userName ? (
        <div className={styles["header__items-wrapper"]}>
          <ThemeToggleBtn />
          <NotificationIcon />
          <NavLink className={getStyle} to="/copy-of-trello/acc-details">
            <div className={styles["header__acc"]}>
              <img
                className={styles["header__user-photo"]}
                src={
                  userPhoto
                    ? userPhoto
                    : theme === "light"
                    ? defaultAvatarBlack
                    : defaultAvatarWhite
                }
                alt="user"
              />
              <span className={styles["header__user-name"]}>{userName}</span>
            </div>
          </NavLink>
        </div>
      ) : (
        <div className={styles["header__auth-nav"]}>
          <ThemeToggleBtn />
          <NavLink className={getStyle} to="/copy-of-trello/sign-in">
            Sign In
          </NavLink>
          <NavLink className={getStyle} to="/copy-of-trello/sign-up">
            Sign Up
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default MainHeader;
