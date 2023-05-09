import React from "react";
import styles from "./NotificationIcon.module.scss";
import { Link } from "react-router-dom";
import { ReactComponent as NotifIcon } from "../../../img/SVG/notification.svg";
import { useAppSelector } from "../../../hooks/redux";

const NotificationIcon = () => {
  const notifCount = useAppSelector(
    (state) => Object.values(state.invite.invites).length
  );
  return (
    <>
      <Link to="notification" className={styles["notification"]}>
        <NotifIcon className={styles["notification__icon"]} />
        <div className={styles["notification__count__wrapper"]}>
          <span className={styles["notification__count"]}>{notifCount}</span>
        </div>
      </Link>
    </>
  );
};

export default NotificationIcon;
