import React from "react";
import styles from "./AddNewColumnItem.module.scss";
import { useAppDispatch } from "../../hooks/redux";
import { createAlert } from "../../store/slices/alert-slice";

interface props {
  index: number;
  getNewListItem: (newItem: string, index: number) => void;
}

const AddNewColumnItem: React.FC<props> = (props) => {
  const [checked, setChecked] = React.useState<boolean>(false);
  const [itemText, setItemText] = React.useState<string>("");
  const dispatch = useAppDispatch();
  console.log(checked);
  function handleCloseBtnClick() {
    setChecked(false);
    setItemText("");
  }
  function handleAddItemClick() {
    if (itemText.trim().length > 0) {
      props.getNewListItem(itemText, props.index);
      setChecked(false);
      setItemText("");
    } else {
      dispatch(
        createAlert({
          alertTitle: "Error",
          alertText: "Textarea must contain at least 1 charachter",
          alertError: true,
        })
      );
    }
  }

  return (
    <>
      {!checked && (
        <form>
          <input
            id={`addItemCheckbox-${props.index}`}
            name="addItemCheckbox"
            type="checkbox"
            style={{ display: "none" }}
            checked={checked}
            onChange={() => {
              setChecked(!checked);
            }}
          />
          <label htmlFor={`addItemCheckbox-${props.index}`}>
            <div className={styles["add-btn"]}>
              <span className={styles["add-btn__plus"]}>&#43;</span>
              <span>Add new item</span>
            </div>
          </label>
        </form>
      )}
      {checked && (
        <form
          className={styles["new-item__form"]}
          onSubmit={handleAddItemClick}
        >
          <textarea
            placeholder="Text.."
            style={{ maxWidth: "100%", maxHeight: "30rem" }}
            name={`addItemTextarea-${props.index}`}
            id={`addItemTextarea-${props.index}`}
            cols={60}
            rows={5}
            value={itemText}
            onChange={(e) => {
              setItemText(e.target.value);
            }}
          ></textarea>
          <div className={styles["new-item__form__btns"]}>
            <button
              type="button"
              onClick={handleAddItemClick}
              className={styles["new-item__form__add-btn"]}
            >
              add list
            </button>
            <span
              onClick={handleCloseBtnClick}
              className={styles["new-item__form__close-btn"]}
            >
              &#10006;
            </span>
          </div>
        </form>
      )}
    </>
  );
};

export default AddNewColumnItem;
