import React from "react";
import styles from "./BoardsList.module.scss";
import "./AddBorderRadius.scss";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import {
  boardsData,
  fetchBoards,
  fetchGuestsBoards,
  guestsBoardDATAI,
} from "../../../store/slices/boards-slice";
import SimpleBar from "simplebar-react";
import { Link } from "react-router-dom";
import AddNewBoard from "./AddNewBoard";

const BoardList = () => {
  const dispatch = useAppDispatch();
  const [fetchedBoardsKeys, setFetchBoardsKeys] = React.useState<string[]>([]);
  const [fetchedBoardsValues, setFetchBoardsValues] = React.useState<
    { boardName: string; boardImg: string; todos?: [] | undefined }[]
  >([]);
  const fetchedBoards = useAppSelector(
    (state) => state.boards.boards
  ) as boardsData;

  const [guestsBoards, setGuestsBoards] = React.useState<guestsBoardDATAI[]>(
    []
  );

  React.useEffect(() => {
    setFetchBoardsKeys(Object.keys(fetchedBoards));
    setFetchBoardsValues(Object.values(fetchedBoards));
  }, [fetchedBoards]);

  const fetchedGuestsBoards = useAppSelector(
    (state) => state.boards.guestsBoards
  );

  React.useEffect(() => {
    console.log(fetchedGuestsBoards);
    setGuestsBoards(fetchedGuestsBoards);
  }, [fetchedGuestsBoards]);
  React.useEffect(() => {
    dispatch(fetchGuestsBoards());
  }, [dispatch]);

  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <div>
      <div className={`${styles["boards"]} boards`}>
        <div className={styles["boards__header"]}>Boards list</div>
        <SimpleBar style={{ maxWidth: "835px", flex: 1 }} forceVisible="x">
          <ul className={styles["boards__list"]}>
            {fetchedBoardsKeys.length > 0 &&
              fetchedBoardsValues.length > 0 &&
              fetchedBoardsKeys.map((el, index) => (
                <li
                  data-theme={theme}
                  style={{
                    backgroundImage:
                      fetchedBoardsValues[index].boardImg &&
                      `url(${fetchedBoardsValues[index].boardImg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className={styles["boards__list__item"]}
                  key={index}
                >
                  <Link className={styles["boards__list__link"]} to={el}>
                    {fetchedBoardsValues[index].boardName}
                  </Link>
                </li>
              ))}

            <AddNewBoard />
          </ul>
        </SimpleBar>
      </div>
      {guestsBoards.length > 0 && (
        <div className={`${styles["boards"]} boards`}>
          <div className={styles["boards__header"]}>Guests boards </div>
          <SimpleBar style={{ maxWidth: "835px", flex: 1 }} forceVisible="x">
            <ul className={styles["boards__list"]}>
              {guestsBoards.map((el, index) => (
                <li
                  data-theme={theme}
                  // style={{
                  //   backgroundImage:
                  //     el.boardDATA.boardData &&
                  //     `url(${fetchedBoardsValues[index].boardImg})`,
                  //   backgroundSize: "cover",
                  //   backgroundPosition: "center",
                  // }}
                  className={styles["boards__list__item"]}
                  key={index}
                >
                  <Link
                    className={styles["boards__list__link"]}
                    to={`guest-board/${el.boardID}`}
                  >
                    {`${el.boardDATA.boardName} (${el.OWNER}'s)`}
                  </Link>
                </li>
              ))}
            </ul>
          </SimpleBar>
        </div>
      )}
    </div>
  );
};

export default BoardList;
