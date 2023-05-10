import React from "react";
import styles from "./BoardMembers.module.scss";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import defaultAvatar from "../../../img/default-avatar--black.png";
import { fetchSharedBoards } from "../../../store/slices/boards-slice";

interface guestI {
  guestID: string;
  guestName: string;
  guestPhoto: string;
}
const BoardMembers: React.FC<{ guest: boolean }> = ({ guest }) => {
  const dispatch = useAppDispatch();
  const [guests, setGuests] = React.useState<guestI[]>();
  const currentBoard = useAppSelector(
    (state) => state.boards.currentGuestBoard
  );
  React.useEffect(() => {
    if (currentBoard) setGuests(Object.values(currentBoard.GUESTS));
  }, [currentBoard, guest]);

  const userID = useAppSelector((state) => state.user.id);
  const sharedBoardDATA = useAppSelector(
    (state) => state.boards.currentSharedBoard
  );
  const currentBoardID = useAppSelector((state) => state.boards.currentBoardID);
  React.useEffect(() => {
    if (userID && !guest)
      dispatch(fetchSharedBoards({ boardID: currentBoardID }));
  }, [dispatch, userID, guest, currentBoardID]);
  return (
    <>
      {!guest && sharedBoardDATA && (
        <div>
          <div className={styles["guests__text"]}>Board Members</div>
          <ul className={styles["guests"]}>
            {Object.values(sharedBoardDATA?.GUESTS).map((el) => (
              <li className={styles["guests__guest"]} key={el.guestID}>
                <div className={styles["guests__guest__name"]}>
                  {el.guestName}
                </div>
                <img
                  className={styles["guests__guest__img"]}
                  src={el.guestPhoto.length > 0 ? el.guestPhoto : defaultAvatar}
                  alt="member"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      {guests && (
        <div>
          <div className={styles["owner"]}>
            <div className={styles["owner__name"]}>{currentBoard?.OWNER}</div>
            <img
              className={styles["owner__img"]}
              src={
                currentBoard?.ownerPHOTO
                  ? currentBoard.ownerPHOTO
                  : defaultAvatar
              }
              alt="owner avatar"
            />
          </div>
          <ul className={styles["guests"]}>
            {guests?.map((el) => (
              <li className={styles["guests__guest"]} key={el.guestID}>
                <div className={styles["guests__guest__name"]}>
                  {el.guestName}
                </div>
                <img
                  className={styles["guests__guest__img"]}
                  src={el.guestPhoto.length > 0 ? el.guestPhoto : defaultAvatar}
                  alt="guest avatar"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default BoardMembers;
