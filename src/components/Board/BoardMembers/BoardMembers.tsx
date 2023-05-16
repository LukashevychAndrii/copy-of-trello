import React from "react";
import styles from "./BoardMembers.module.scss";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import defaultAvatarBlack from "../../../img/default-avatar--black.png";
import defaultAvatarWhite from "../../../img/default-avatar--white.png";
import {
  fetchSharedBoards,
  removeGuestBoard,
} from "../../../store/slices/boards-slice";
import { removeUser } from "../../../store/slices/invite-slice";
import { useNavigate } from "react-router-dom";
import { createAlert } from "../../../store/slices/alert-slice";

interface guestI {
  guestID: string;
  guestName: string;
  guestPhoto: string;
}
const BoardMembers: React.FC<{ guest: boolean }> = ({ guest }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [guests, setGuests] = React.useState<guestI[]>();
  const currentBoard = useAppSelector(
    (state) => state.boards.currentGuestBoard
  );
  React.useEffect(() => {
    if (currentBoard?.GUESTS) setGuests(Object.values(currentBoard.GUESTS));
    if (currentBoard && !currentBoard.GUESTS && guest) {
      dispatch(
        removeGuestBoard({
          boardID: currentBoard?.boardID,
          ownerNAME: currentBoard?.OWNER,
          ownerID: currentBoard?.ownerID,
        })
      );
      dispatch(
        createAlert({
          alertTitle: "Database error!",
          alertText: `You were kicked from guest board by ${currentBoard.OWNER}`,
          alertError: true,
        })
      );
      navigate("/copy-of-trello");
    }
  }, [currentBoard, guest, dispatch, navigate]);

  const userID = useAppSelector((state) => state.user.id);
  const sharedBoardDATA = useAppSelector(
    (state) => state.boards.currentSharedBoard
  );
  const currentBoardID = useAppSelector((state) => state.boards.currentBoardID);
  React.useEffect(() => {
    if (userID && !guest)
      dispatch(fetchSharedBoards({ boardID: currentBoardID }));
  }, [dispatch, userID, guest, currentBoardID]);
  const guestBoard = useAppSelector((state) => state.boards.currentGuestBoard);

  React.useEffect(() => {
    if (guestBoard?.GUESTS && guest) {
      const guestsIDS = Object.keys(guestBoard?.GUESTS);
      const foundID = guestsIDS.findIndex((el) => el === userID);
      if (foundID === -1) {
        dispatch(
          removeGuestBoard({
            boardID: guestBoard.boardID,
            ownerNAME: guestBoard.OWNER,
            ownerID: guestBoard.ownerID,
          })
        );
        navigate("/copy-of-trello");
        dispatch(
          createAlert({
            alertTitle: "Database error!",
            alertText: `You were kicked from guest board by ${guestBoard.OWNER}`,
            alertError: true,
          })
        );
      }
    }
  }, [userID, dispatch, navigate, guest, guestBoard]);

  function handleRemoveUser(guestID: string) {
    dispatch(removeUser({ userID: guestID }));
  }

  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <div className={styles["guests__wrapper"]}>
      {!guest && sharedBoardDATA?.GUESTS && (
        <div>
          <div board-members-theme={theme} className={styles["guests__text"]}>
            {`Board Members (${sharedBoardDATA.boardDATA.boardName})`}
          </div>
          <ul board-members-theme={theme} className={styles["guests"]}>
            {Object.values(sharedBoardDATA?.GUESTS).map((el) => (
              <li className={styles["guests__guest"]} key={el.guestID}>
                <div className={styles["guests__guest__name"]}>
                  {el.guestName}
                </div>
                <img
                  style={{ marginRight: "2rem" }}
                  className={styles["guests__guest__img"]}
                  src={
                    el.guestPhoto.length > 0
                      ? el.guestPhoto
                      : theme === "light"
                      ? defaultAvatarBlack
                      : defaultAvatarWhite
                  }
                  alt="member"
                />
                <span
                  onClick={() => {
                    handleRemoveUser(el.guestID);
                  }}
                  className={styles["guests__guest__remove-btn"]}
                >
                  &times;
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {guests && currentBoard?.OWNER && (
        <div>
          <div board-members-theme={theme} className={styles["owner"]}>
            <div board-members-theme={theme} className={styles["owner__name"]}>
              {currentBoard?.OWNER}
            </div>
            <img
              className={styles["owner__img"]}
              src={
                currentBoard?.ownerPHOTO
                  ? currentBoard.ownerPHOTO
                  : theme === "light"
                  ? defaultAvatarBlack
                  : defaultAvatarWhite
              }
              alt="owner avatar"
            />
          </div>
          <div style={{ width: "100%" }}>
            <ul board-members-theme={theme} className={styles["guests"]}>
              <div className={styles["guests__guest__name"]}>
                {`Bord name - ${currentBoard.boardDATA.boardName}`}
              </div>
              {guests?.map((el) => (
                <li className={styles["guests__guest"]} key={el.guestID}>
                  <div className={styles["guests__guest__name"]}>
                    {el.guestID === userID
                      ? `${el.guestName} (you)`
                      : el.guestName}
                  </div>
                  <img
                    className={styles["guests__guest__img"]}
                    src={
                      el.guestPhoto.length > 0
                        ? el.guestPhoto
                        : theme === "light"
                        ? defaultAvatarBlack
                        : defaultAvatarWhite
                    }
                    alt="guest avatar"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardMembers;
