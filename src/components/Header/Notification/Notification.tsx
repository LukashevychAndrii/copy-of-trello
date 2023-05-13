import React from "react";
import styles from "./Notification.module.scss";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import defaultImg from "../../../img/default-avatar--black.png";
import { acceptInvite, rejectInvite } from "../../../store/slices/invite-slice";

const Notification: React.FC = () => {
  const [inviteIDS, setInviteIDS] = React.useState<string[]>([]);
  const [inviteVALUES, setInviteVALUES] = React.useState<any[]>([]);

  const invites = useAppSelector((state) => state.invite.invites);

  React.useEffect(() => {
    setInviteIDS(Object.keys(invites));
    setInviteVALUES(Object.values(invites));
    console.log(Object.values(invites));
  }, [invites]);

  const dispatch = useAppDispatch();

  function handleAcceptClick(
    notifID: string,
    boardID: string,
    inviterID: string,
    inviterName: string,
    inviterDATA: [],
    boardName: string,
    inviterPhoto: string,
    boardPhoto: string
  ) {
    dispatch(
      acceptInvite({
        notifID: notifID,
        boardID: boardID,
        inviterID: inviterID,
        inviterName: inviterName,
        inviterDATA: inviterDATA,
        boardName: boardName,
        inviterPhoto: inviterPhoto,
        boardPhoto: boardPhoto,
      })
    );
  }
  function handleRejectClick(notifID: string) {
    dispatch(rejectInvite({ notifID: notifID }));
  }

  return (
    <div className={styles["notification"]}>
      <div className={styles["notification__invites--header"]}>Invites</div>
      <div className={styles["notification__invites"]}>
        <ul className={styles["notification__invite-list"]}>
          {inviteVALUES.length > 0 ? (
            inviteVALUES.map((el, index) => (
              <li key={index} className={styles["notification__invite"]}>
                <span>{el.inviterName}</span>
                <img
                  src={el.inviterPhoto ? el.inviterPhoto : defaultImg}
                  alt="inviter avatar"
                />
                <div className={styles["notification__invite__buttons"]}>
                  <button
                    onClick={() => {
                      handleAcceptClick(
                        inviteIDS[index],
                        inviteVALUES[index].boardID,
                        inviteVALUES[index].inviterID,
                        inviteVALUES[index].inviterName,
                        inviteVALUES[index].inviterDATA,
                        inviteVALUES[index].inviterDATA.boardName,
                        inviteVALUES[index].inviterPhoto,
                        inviteVALUES[index].boardPhoto
                      );
                    }}
                    className={styles["notification__invite__button"]}
                  >
                    Accept
                  </button>
                  <button
                    className={styles["notification__invite__button"]}
                    onClick={() => {
                      handleRejectClick(inviteIDS[index]);
                    }}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className={styles["notification__invite__clear"]}>
              Invite list is clear! (if you didn't get invite - try reload the
              page)
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Notification;
