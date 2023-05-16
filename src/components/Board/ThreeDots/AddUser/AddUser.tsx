import React from "react";
import styles from "./AddUser.module.scss";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { Link } from "react-router-dom";

import { getDatabase, get, ref } from "firebase/database";
import { app } from "../../../../firebase";
import { createAlert } from "../../../../store/slices/alert-slice";
import { sendInvite } from "../../../../store/slices/invite-slice";

import defaultUserPhoto from "../../../../img/default-avatar--black.png";

interface props {
  hideAddUser: () => void;
}

const AddUser: React.FC<props> = (props) => {
  const [checked, setChecked] = React.useState<boolean>(false);
  const theme = useAppSelector((state) => state.theme.theme);
  const dispatch = useAppDispatch();
  const userID = useAppSelector((state) => state.user.id);

  const [inviteUserName, setInviteUserName] = React.useState("");
  const [inviteUserPhoto, setInviteUserPhoto] = React.useState("");

  const [userInput, setUserInput] = React.useState("");

  const formRef = React.useRef(null);

  React.useEffect(() => {
    if (userInput.trim().length > 0) {
      if (userInput === userID) {
        dispatch(
          createAlert({
            alertTitle: "Error!",
            alertText: "You cannot invite yourself",
            alertError: true,
          })
        );
      } else {
        const addUser = async () => {
          const db = getDatabase(app);
          const snapshot = await get(ref(db, `users/${userInput}`));
          if (snapshot.exists()) {
            const uData = snapshot.val();
            setInviteUserName(uData.userdata.uName);
            setInviteUserPhoto(uData.userdata.uPhoto);
          } else {
            dispatch(
              createAlert({
                alertTitle: "Error!",
                alertText: "Could not find user!",
                alertError: true,
              })
            );
          }
        };
        addUser();
      }
    }
  }, [userInput, dispatch, userID]);

  function useHandleClickOutside(formRef: any) {
    React.useEffect(() => {
      function handleClickOutside(event: any) {
        if (formRef.current && !formRef.current.contains(event.target)) {
          props.hideAddUser();
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [formRef]);
  }
  useHandleClickOutside(formRef);

  return (
    <div ref={formRef}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        theme-three-dots={theme}
        className={styles["add-user"]}
      >
        <label htmlFor="add-user"></label>
        <input
          type="text"
          name="add-user"
          id="add-user"
          placeholder="Enter user id.."
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value);
          }}
        />
        <input
          type="checkbox"
          name="question-mark"
          id="question-mark"
          className={styles["add-user__checkbox"]}
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked);
          }}
        />
        <label htmlFor="question-mark"></label>
        <div
          onMouseOver={() => {
            setChecked(true);
          }}
          onMouseLeave={() => {
            setChecked(false);
          }}
          className={styles["add-user__question-mark__wrapper"]}
        >
          <span className={styles["add-user__question-mark"]}> &#63;</span>
        </div>
        <div className={styles["add-user__clue"]}>
          You can get user id in your{" "}
          <Link to="/copy-of-trello/acc-details">Acc Details</Link>
        </div>
      </form>
      {inviteUserName && (
        <div theme-three-dots={theme} className={styles["found-user"]}>
          <div className={styles["found-user__data"]}>
            <div>{inviteUserName}</div>

            <img
              className={styles["found-user__img"]}
              src={inviteUserPhoto ? inviteUserPhoto : defaultUserPhoto}
              alt="found user"
            />
          </div>
          <button
            onClick={() => {
              dispatch(sendInvite({ inviteUserID: userInput }));
              props.hideAddUser();
            }}
            type="button"
            className={styles["found-user__invite-btn"]}
            invite-btn-theme={theme}
          >
            Invite +
          </button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
