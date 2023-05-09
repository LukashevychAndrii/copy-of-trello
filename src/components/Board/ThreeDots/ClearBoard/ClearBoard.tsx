import React from "react";
import styles from "./ClearBoard.module.scss";
import { useAppDispatch } from "../../../../hooks/redux";
import { updateUserTodos } from "../../../../store/slices/boards-slice";
import { dataI } from "../../Board";

interface props {
  showClearBoard: boolean;
  setShowClearBoard: React.Dispatch<React.SetStateAction<boolean>>;

  setList: React.Dispatch<React.SetStateAction<dataI[]>>;
}

const ClearBoard: React.FC<props> = (props) => {
  const dispatch = useAppDispatch();
  return (
    <div className={styles["clear"]}>
      <span>Are you sure you want to clear board?</span>
      <div className={styles["clear__buttons"]}>
        <button
          type="button"
          className={styles["clear__button"]}
          onClick={() => {
            dispatch(updateUserTodos({ data: [] }));
            props.setList([]);
            props.setShowClearBoard(false);
          }}
        >
          Yes, clear
        </button>
        <button
          type="button"
          className={styles["clear__button"]}
          onClick={() => {
            props.setShowClearBoard(false);
          }}
        >
          Cansel
        </button>
      </div>
    </div>
  );
};

export default ClearBoard;
