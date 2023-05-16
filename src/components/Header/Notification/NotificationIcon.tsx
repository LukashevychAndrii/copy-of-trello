import React from "react";
import styles from "./NotificationIcon.module.scss";
import notif from "../../../sounds/new-notif-sound.mp3";

import { Link } from "react-router-dom";
import { ReactComponent as NotifIcon } from "../../../img/SVG/notification.svg";
import { useAppSelector } from "../../../hooks/redux";

let firstRender = true;

const NotificationIcon = () => {
  const [notifSound, setNotifSound] = React.useState(false);
  const notifRef = React.useRef<HTMLAudioElement>(null);
  const notifCount = useAppSelector(
    (state) => Object.values(state.invite.invites).length
  );
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    setCount(notifCount);
  }, [notifCount]);
  React.useEffect(() => {
    console.log(count);
    console.log(notifCount);
    if (!firstRender) {
      if (count < notifCount) {
        setNotifSound(true);
      }
      setTimeout(() => {
        setNotifSound(false);
      }, 2000);
    } else {
      firstRender = false;
    }
  }, [notifCount]);

  React.useEffect(() => {
    if (notifSound) {
      if (notifRef.current) {
        notifRef.current.play().catch((error) => console.log(error));
      }
    }
  }, [notifSound]);
  return (
    <>
      <Link
        to="/copy-of-trello/notification"
        className={`${styles["notification"]}`}
      >
        {notifSound && (
          <audio
            style={{ display: "none" }}
            ref={notifRef}
            controls
            src={notif}
          ></audio>
        )}
        <NotifIcon className={styles["notification__icon"]} />
        <div className={styles["notification__count__wrapper"]}>
          <span className={styles["notification__count"]}>{notifCount}</span>
        </div>
      </Link>
    </>
  );
};

export default NotificationIcon;
