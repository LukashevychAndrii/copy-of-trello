import React from "react";
import styles from "./UPhoto.module.scss";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import {
  setUserPhoto,
  updateUserProfilePhoto,
} from "../../../store/slices/user-slice";
import Avatar from "react-avatar-edit";

interface props {
  showAvatarLoader: boolean;
  setShowAvatarLoader: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadUPhoto: React.FC<props> = (props) => {
  const [src, setSrc] = React.useState("");
  const [, setPreview] = React.useState<string | null>("");

  const userID = useAppSelector((state) => state.user.id);
  const dispatch = useAppDispatch();

  const onCrop = (view: string) => {
    setSrc(view);
    setPreview(view);
  };
  const onClose = () => {
    setPreview(null);
  };
  function handleSetPhotoClick() {
    dispatch(setUserPhoto({ uPhoto: src }));
    console.log(src);
    props.setShowAvatarLoader(false);
    setPreview(null);
    if (userID) dispatch(updateUserProfilePhoto());
  }

  return (
    <div
      className={styles["acc-details__set-avatar--wrapper"]}
      style={{ display: props.showAvatarLoader ? "block" : "none" }}
    >
      <div className={styles["acc-details__set-avatar"]}>
        <Avatar
          width={400}
          onCrop={onCrop}
          onClose={onClose}
          height={300}
          labelStyle={{ color: "white", fontSize: "2rem" }}
        />
        <div className={styles["acc-details__set-avatar__btns"]}>
          <button
            onClick={handleSetPhotoClick}
            disabled={!!!src}
            className={styles["acc-details__set-btn"]}
            type="button"
          >
            Set new profile picture
          </button>
          <span
            onClick={() => {
              props.setShowAvatarLoader(false);
            }}
            className={styles["acc-details__close-btn"]}
          >
            &times;
          </span>
        </div>
      </div>
    </div>
  );
};

export default UploadUPhoto;
