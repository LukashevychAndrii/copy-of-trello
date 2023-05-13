import React from "react";
import styles from "./UPhoto.module.scss";
import defaultAvatar from "../../../img/default-avatar--black.png";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import {
  removeUserPhoto,
  updateUserProfilePhoto,
} from "../../../store/slices/user-slice";
import UploadUPhoto from "./UploadUPhoto";

const UPhoto = () => {
  const [showAvatarLoader, setShowAvatarLoader] = React.useState(false);

  const [checked, setChecked] = React.useState(false);

  const uPhoto = useAppSelector((state) => state.user.uPhoto);
  const userID = useAppSelector((state) => state.user.id);
  const dispatch = useAppDispatch();
  function handlerRemovePhoto() {
    dispatch(removeUserPhoto());
    if (userID) dispatch(updateUserProfilePhoto());
    setChecked(false);
  }

  const ref = React.useRef(null);
  const ref2 = React.useRef(null);
  function useOutsideAlerter(
    ref: React.MutableRefObject<any>,
    ref2: React.MutableRefObject<any>
  ) {
    React.useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */

      function handleClickOutside(event: any) {
        if (
          ref.current &&
          !ref.current.contains(event.target) &&
          ref2.current &&
          !ref2.current.contains(event.target)
        ) {
          setChecked(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, ref2]);
  }
  useOutsideAlerter(ref, ref2);

  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <div className={styles["acc-details"]}>
      {uPhoto ? (
        <img
          className={styles["acc-details__photo"]}
          src={uPhoto}
          alt="avatar"
        ></img>
      ) : (
        <img
          className={styles["acc-details__photo"]}
          src={defaultAvatar}
          alt="default avatar"
        />
      )}
      <form>
        <input
          id="acc-details__checkbox"
          name="acc-details__checkbox"
          type="checkbox"
          className={styles["acc-details__checkbox"]}
          checked={checked}
          onChange={() => {
            setChecked(!checked);
          }}
        />
        <label
          htmlFor="acc-details__checkbox"
          style={{ marginTop: "1rem", display: "block" }}
        >
          <span
            sign-out-theme={theme}
            ref={ref}
            className={styles["acc-details__edit-btn"]}
          >
            &#9998; Edit
          </span>
        </label>

        <div ref={ref2} className={styles["acc-details__edit-btn--choise"]}>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              setShowAvatarLoader(true);
              setChecked(false);
            }}
          >
            Upload a photo..
          </span>
          <span style={{ cursor: "pointer" }} onClick={handlerRemovePhoto}>
            Remove photo
          </span>
        </div>

        <UploadUPhoto
          showAvatarLoader={showAvatarLoader}
          setShowAvatarLoader={setShowAvatarLoader}
        />
      </form>
    </div>
  );
};

export default UPhoto;
