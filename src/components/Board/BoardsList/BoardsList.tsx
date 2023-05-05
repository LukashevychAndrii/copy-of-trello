import React from "react";
import styles from "./BoardsList.module.scss";
import "./AddBorderRadius.scss";
import { useAppSelector } from "../../../hooks/redux";
import { boardsData } from "../../../store/slices/boards-slice";
import { get, getDatabase, ref } from "firebase/database";
import { app } from "../../../firebase";
import SimpleBar from "simplebar-react";
import { Link } from "react-router-dom";
import AddNewBoard from "./AddNewBoard";

const BoardList = () => {
  const [fetchedBoardsKeys, setFetchBoardsKeys] = React.useState<string[]>([]);
  const [fetchedBoardsValues, setFetchBoardsValues] = React.useState<
    { boardName: string; boardImg: string; todos?: [] | undefined }[]
  >([]);
  const fetchedBoards = useAppSelector(
    (state) => state.boards.boards
  ) as boardsData;
  React.useEffect(() => {
    setFetchBoardsKeys(Object.keys(fetchedBoards));
    setFetchBoardsValues(Object.values(fetchedBoards));
    console.log(Object.values(fetchedBoards));
  }, [fetchedBoards]);

  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <div className={`${styles["boards"]} boards`}>
      <div className={styles["boards__header"]}>Board list</div>
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
  );
};

export default BoardList;

export const useLoader = () => {
  const userID = useAppSelector((state) => state.user.id);
  const db = getDatabase(app);
  let reternedData;
  if (userID) {
    const userRef = ref(db, `user/${userID}/`);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) reternedData = snapshot.val();
    });
  }
  console.log(reternedData);
  return null;
};
