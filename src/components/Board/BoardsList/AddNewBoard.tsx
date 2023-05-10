import React from "react";
import styles from "./AddNewBoard.module.scss";

import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { Link } from "react-router-dom";
import { createBoard } from "../../../store/slices/boards-slice";

const AddNewBoard = () => {
  const [checked, setChecked] = React.useState(false);
  const [boardName, setBoardName] = React.useState("");

  const userID = useAppSelector((state) => state.user.id);
  const dispatch = useAppDispatch();

  function handleCreateClick() {
    if (boardName.trim().length > 0) {
      dispatch(createBoard({ boardName: boardName }));
      setChecked(false);
      setBoardName("");
    }
  }
  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleCreateClick();
      }}
    >
      <input
        className={styles["boards__input"]}
        name="add-board"
        id="add-board"
        type="checkbox"
        checked={checked}
        onChange={() => {
          setChecked(true);
        }}
      />
      <label htmlFor="add-board">
        {!userID ? (
          <Link to="sign-in" className={styles["boards__add-btn"]}>
            Add new board
          </Link>
        ) : (
          <div className={styles["boards__add-btn"]}>Add new board</div>
        )}
      </label>
      <div className={styles["boards__create-panel"]}>
        <input
          type="text"
          name="new-board__name"
          id="new-board__name"
          placeholder="Enter board name.."
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          className={styles["boards__create-panel__input"]}
        />

        <label
          className={styles["boards__create-panel__label"]}
          htmlFor="new-board__name"
        ></label>
        <div className={styles["boards__create-panel__buttons"]}>
          <button
            create-btn-theme={theme}
            className={styles["boards__create-panel__buttons--create-btn"]}
            type="button"
            onClick={handleCreateClick}
          >
            Create
          </button>
          <span
            className={styles["boards__create-panel__buttons--close-btn"]}
            onClick={() => {
              setChecked(false);
              setBoardName("");
            }}
          >
            &times;
          </span>
        </div>
      </div>
    </form>
  );
};

export default AddNewBoard;
