import React from "react";
import styles from "./ThreeDots.module.scss";
import { ReactComponent as PaintIcon } from "../../../img/SVG/paint-format.svg";
import { ReactComponent as AddUserIcon } from "../../../img/SVG/user-plus.svg";
import { ReactComponent as ClearIcon } from "../../../img/SVG/delete_forever.svg";

import { useAppSelector } from "../../../hooks/redux";
import CustomBackground from "./CustomBackground/CustomBackground";
import ClearBoard from "./ClearBoard/ClearBoard";
import { dataI } from "../Board";
import AddUser from "./AddUser/AddUser";

interface props {
  setList: React.Dispatch<React.SetStateAction<dataI[]>>;
}
const ThreeDots: React.FC<props> = (props) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [checked, setChecked] = React.useState<boolean>(false);

  const [showCustomBg, setShowCustomBg] = React.useState(false);
  const [showClearBoard, setShowClearBoard] = React.useState(false);
  const [showAddUser, setShowAddUser] = React.useState(false);

  const ref = React.useRef(null);
  function hideCustomBg() {
    setShowCustomBg(false);
  }
  function hideAddUser() {
    setShowAddUser(false);
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
    <>
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
              setShowAddUser(true);
              setChecked(false);
            }}
          >
            <AddUserIcon />
            <span>Add user's</span>
          </li>
          <li
            onClick={() => {
              setChecked(false);
              setShowClearBoard(true);
            }}
          >
            <ClearIcon />
            <span>Clear board</span>
          </li>
        </ul>
        {showCustomBg && <CustomBackground hideCustomBg={hideCustomBg} />}
        {showClearBoard && (
          <ClearBoard
            setList={props.setList}
            showClearBoard={showClearBoard}
            setShowClearBoard={setShowClearBoard}
          />
        )}
      </form>
      {showAddUser && <AddUser hideAddUser={hideAddUser} />}
    </>
  );
};

export default ThreeDots;
