import React from "react";
import styles from "./CustomBackground.module.scss";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { createAlert } from "../../../../store/slices/alert-slice";
import { setBoardImg } from "../../../../store/slices/user-slice";
import {
  setCurrentBoardIMG,
  updateBoardImg,
} from "../../../../store/slices/boards-slice";

interface props {
  hideCustomBg: () => void;
}
const CustomBackground: React.FC<props> = (props) => {
  const dispatch = useAppDispatch();

  const [over, setOver] = React.useState<boolean>(false);

  function dragStartHandler(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setOver(true);
  }
  function dragDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (
      droppedFiles[0].type === "image/png" ||
      droppedFiles[0].type === "image/jpeg" ||
      droppedFiles[0].type === "image/gif"
    ) {
      const reader = new FileReader();
      reader.readAsDataURL(droppedFiles[0]);
      reader.onload = () => {
        dispatch(setCurrentBoardIMG(reader.result));
        dispatch(updateBoardImg());
      };
    } else {
      dispatch(
        createAlert({
          alertTitle: "Error!",
          alertText:
            "The format of file is not supported. Supported formats: PNG, JPEG, GIF",
          alertError: true,
        })
      );
    }
  }

  const dropAreaRef = React.useRef(null);

  function useHandleClickOutside(dropAreaRef: any) {
    React.useEffect(() => {
      function handleClickOutside(event: any) {
        if (
          dropAreaRef.current &&
          !dropAreaRef.current.contains(event.target)
        ) {
          props.hideCustomBg();
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [dropAreaRef]);
  }
  useHandleClickOutside(dropAreaRef);
  const customBG = useAppSelector((state) => state.boards.currentBoardIMG);

  return (
    <div className={styles["drag__wrapper"]}>
      {customBG ? (
        <div className={styles["drag__items-wrapper"]}>
          <div
            onDragStart={(e) => e.preventDefault()}
            onDrop={(e) => dragDrop(e)}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={(e) => {
              e.preventDefault();
            }}
            className={styles["drag"]}
          >
            <img className={styles["drag__img"]} src={customBG} alt="board" />
          </div>
          <div className={styles["drag__buttons"]}>
            <div style={{ display: "flex", gap: "2.5rem" }}>
              <button
                type="button"
                onClick={() => {
                  props.hideCustomBg();
                  dispatch(updateBoardImg());
                }}
                className={styles["drag__buttons__add-btn"]}
              >
                Set image
              </button>
              <button
                type="button"
                onClick={() => {
                  dispatch(setCurrentBoardIMG(""));
                  dispatch(updateBoardImg());
                  setOver(false);
                }}
                className={styles["drag__buttons__remove-btn"]}
              >
                Remove image
              </button>
            </div>
            <span
              onClick={() => {
                props.hideCustomBg();
              }}
              className={styles["drag__buttons__close-btn"]}
            >
              &times;
            </span>
          </div>
        </div>
      ) : (
        <>
          <div
            ref={dropAreaRef}
            onDragStart={(e) => dragStartHandler(e)}
            onDrop={(e) => dragDrop(e)}
            onDragOver={(e) => dragStartHandler(e)}
            onDragLeave={(e) => {
              e.preventDefault();
              setOver(false);
            }}
            className={`${styles["drag"]} ${!over && styles["drag__over"]}`}
          >
            Drop file here
          </div>
          <div className={styles["drag__buttons"]}>
            <div
              style={{ display: "flex", width: "100%", justifyContent: "end" }}
            >
              <div
                onClick={() => {
                  props.hideCustomBg();
                }}
                className={styles["drag__buttons__close-btn"]}
              >
                &times;
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomBackground;
