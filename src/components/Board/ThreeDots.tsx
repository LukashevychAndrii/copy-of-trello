import React from "react";
import styles from "./ThreeDots.module.scss";
import { ReactComponent as PaintIcon } from "../../img/SVG/paint-format.svg";
import { ReactComponent as AddUserIcon } from "../../img/SVG/user-plus.svg";
import { ReactComponent as ShareIcon } from "../../img/SVG/share.svg";
import { ReactComponent as ClearIcon } from "../../img/SVG/delete_forever.svg";

import { useAppSelector } from "../../hooks/redux";

const ThreeDots = () => {
  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <form>
      <input
        style={{ display: "none" }}
        id="three-dots__checkbox"
        name="three-dots__checkbox"
        type="checkbox"
        className={styles["three-dots__checkbox"]}
      />
      <label htmlFor="three-dots__checkbox">
        <div className={styles["three-dots"]} theme-three-dots={theme}>
          <div className={styles["three-dots__wrapper"]}></div>
        </div>
      </label>
      <ul theme-three-dots={theme} className={styles["three-dots__choice"]}>
        <li>
          <PaintIcon />
          <span>Set custom board's background</span>
        </li>
        <li>
          <AddUserIcon />
          <span>Add user's</span>
        </li>
        <li>
          <ShareIcon />
          <span>Share board</span>
        </li>
        <li>
          <ClearIcon />
          <span>Clear board</span>
        </li>
      </ul>
    </form>
  );
};

export default ThreeDots;
