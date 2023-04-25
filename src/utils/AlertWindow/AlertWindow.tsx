import React from "react";
import styles from "./AlertWindow.module.scss";
import { ReactComponent as SuccessIcon } from "../../img/SVG/checkmark2.svg";
import { ReactComponent as ErrorIcon } from "../../img/SVG/error_outline.svg";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { clearAlert } from "../../store/slices/alert-slice";

const AlertWindow: React.FC = () => {
  const [show, setShow] = React.useState(false);
  const dispatch = useAppDispatch();
  const alertTitle = useAppSelector((state) => state.alert.alertTitle);
  const alertText = useAppSelector((state) => state.alert.alertText);
  const alertError = useAppSelector((state) => state.alert.alertError);

  React.useEffect(() => {
    if (alertTitle) {
      setShow(true);
      let timeout2: NodeJS.Timeout;
      const timeout = setTimeout(() => {
        setShow(false);
        timeout2 = setTimeout(() => {
          dispatch(clearAlert());
        }, 0);
      }, 5000);
      return () => {
        clearTimeout(timeout);
        clearTimeout(timeout2);
      };
    }
  }, [alertTitle, dispatch]);

  function handleCloseBtn() {
    setShow(false);
  }

  return (
    <div
      className={show ? styles["alert-window"] : styles["alert-window--close"]}
    >
      {alertError ? (
        <ErrorIcon className={styles["alert-window__icon--error"]} />
      ) : (
        <SuccessIcon className={styles["alert-window__icon--success"]} />
      )}
      <div className={styles["alert-window__text"]}>
        <p className={styles["alert-window__title"]}>{alertTitle}</p>
        <p className={styles["alert-window__text"]}>{alertText}</p>
        <span
          onClick={handleCloseBtn}
          className={styles["alert-window__close-btn"]}
        >
          &times;
        </span>
      </div>
    </div>
  );
};

export default AlertWindow;
