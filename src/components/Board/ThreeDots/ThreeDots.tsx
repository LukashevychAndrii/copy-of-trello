import React from "react";
import styles from "./ThreeDots.module.scss";
import { ReactComponent as PaintIcon } from "../../../img/SVG/paint-format.svg";
import { ReactComponent as AddUserIcon } from "../../../img/SVG/user-plus.svg";
import { ReactComponent as ShareIcon } from "../../../img/SVG/share.svg";
import { ReactComponent as ClearIcon } from "../../../img/SVG/delete_forever.svg";

import { useAppSelector } from "../../../hooks/redux";
import CustomBackground from "./CustomBackground/CustomBackground";

const ThreeDots = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [checked, setChecked] = React.useState<boolean>(false);

  const [showCustomBg, setShowCustomBg] = React.useState(false);
  const ref = React.useRef(null);
  function hideCustomBg() {
    setShowCustomBg(false);
  }

  function useHandleClickOutside(dropAreaRef: any) {
    React.useEffect(() => {
      function handleClickOutside(event: any) {
        if (
          dropAreaRef.current &&
          !dropAreaRef.current.contains(event.target)
        ) {
          setChecked(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [dropAreaRef]);
  }
  useHandleClickOutside(ref);

  return (
    <form ref={ref}>
      <input
        style={{ display: "none" }}
        id="three-dots__checkbox"
        name="three-dots__checkbox"
        type="checkbox"
        className={styles["three-dots__checkbox"]}
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
      <label htmlFor="three-dots__checkbox">
        <div className={styles["three-dots"]} theme-three-dots={theme}>
          <div className={styles["three-dots__wrapper"]}></div>
        </div>
      </label>
      <ul theme-three-dots={theme} className={styles["three-dots__choice"]}>
        <li
          onClick={() => {
            setShowCustomBg(true);
            setChecked(false);
          }}
        >
          <PaintIcon />
          <span>Set custom board's background</span>
        </li>
        <li
          onClick={() => {
            setChecked(false);
          }}
        >
          <AddUserIcon />
          <span>Add user's</span>
        </li>
        <li
          onClick={() => {
            setChecked(false);
          }}
        >
          <ClearIcon />
          <span>Clear board</span>
        </li>
      </ul>
      {showCustomBg && <CustomBackground hideCustomBg={hideCustomBg} />}
    </form>
  );
};

export default ThreeDots;
