import React from "react";
import styles from "./SmallBoard.module.scss";
import { useAppSelector } from "../../../hooks/redux";
import { Link } from "react-router-dom";

const SmallBoardList = () => {
  const boards = useAppSelector((state) => state.boards.boards);
  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <>
      {boards && (
        <ul className={styles["boards"]}>
          {Object.values(boards).map((el, index) => (
            <li key={index}>
              <Link
                to={`/${Object.keys(boards)[index]}`}
                small-board-theme={theme}
                style={{
                  backgroundImage: el.boardImg && `url(${el.boardImg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className={styles["boards__item"]}
              >
                <div className={styles["boards__item__name"]}>
                  {el.boardName}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default SmallBoardList;
