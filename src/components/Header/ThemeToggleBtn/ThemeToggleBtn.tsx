import React from "react";
import styles from "./ThemeToggleBtn.module.scss";
import { ReactComponent as SunIcon } from "../../../img/SVG/sun.svg";
import { ReactComponent as MoonIcon } from "../../../img/SVG/moon.svg";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setTheme } from "../../../store/slices/theme-slice";

const Theme = () => {
  const [checked, setChecked] = React.useState(true);
  React.useEffect(() => {
    const theme = localStorage.getItem("todo-theme");
    if (theme) setChecked(theme === "dark");
  }, []);
  const dispatch = useAppDispatch();

  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <form>
      <input
        className={styles["theme__input"]}
        id="theme-checkbox"
        name="theme-checkbox"
        type="checkbox"
        checked={checked}
        onChange={() => {
          setChecked(!checked);
        }}
        onClick={() => {
          dispatch(setTheme());
        }}
      />
      <label htmlFor="theme-checkbox">
        <div
          theme-toggle-btn={theme}
          className={`${styles["theme"]} ${
            checked ? styles["theme--moon"] : styles["theme--sun"]
          }`}
        >
          <SunIcon className={styles["sun"]} />
          <MoonIcon className={styles["moon"]} />
        </div>
      </label>
    </form>
  );
};

export default Theme;
