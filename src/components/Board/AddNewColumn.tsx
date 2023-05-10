import React from "react";
import styles from "./AddNewColumn.module.scss";
import { useAppDispatch } from "../../hooks/redux";
import { createAlert } from "../../store/slices/alert-slice";

import { dataI } from "./Board";

interface props {
  getNewList: (newList: dataI) => void;
}

const AddNewColumn: React.FC<props> = (props) => {
  const [checked, setChecked] = React.useState<boolean>(false);
  const [listName, setListName] = React.useState<string>("");
  const dispatch = useAppDispatch();
  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    setChecked(e.target.checked);
  }
  function handleCloseBtnClick() {
    setChecked(false);
  }
  function handleAddBtnClick() {
    if (listName.trim().length === 0) {
      dispatch(
        createAlert({
          alertTitle: "Error!",
          alertText: "List name must contain at least 1 charachter",
          alertError: true,
        })
      );
    } else {
      setListName("");
      setChecked(false);
      const newList: dataI = { title: listName, items: [] };
      props.getNewList(newList);
    }
  }
  return (
    <div>
      {checked && (
        <form
          className={styles["add-form"]}
          onSubmit={(e) => {
            e.preventDefault();
            handleAddBtnClick();
          }}
        >
          <input
            value={listName}
            onChange={(e) => {
              setListName(e.target.value);
            }}
            id="column-name"
            name="column-name"
            type="text"
            className={styles["add-form__input"]}
            placeholder="Name of list.."
          />
          <label htmlFor="column-name"></label>
          <div className={styles["add-form__btns"]}>
            <button
              type="button"
              onClick={handleAddBtnClick}
              className={styles["add-form__add-btn"]}
            >
              add list
            </button>
            <span
              onClick={handleCloseBtnClick}
              className={styles["add-form__close-btn"]}
            >
              &#10006;
            </span>
          </div>
        </form>
      )}
      {!checked && (
        <form>
          <input
            onChange={handleCheckboxChange}
            className={styles["checkbox"]}
            id="checkbox"
            name="checkbox"
            type="checkbox"
          />
          <label htmlFor="checkbox">
            <span className={styles["add-column"]}>Add new column</span>
          </label>
        </form>
      )}
    </div>
  );
};

export default AddNewColumn;
