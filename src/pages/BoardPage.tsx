import React from "react";
import Board from "../components/Board/Board";
import { getDatabase, ref, get, onValue } from "firebase/database";
import { app } from "../firebase";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { createAlert } from "../store/slices/alert-slice";
import { useParams } from "react-router-dom";

const BoardPage = () => {
  const [todos, setTodos] = React.useState([]);
  const userID = useAppSelector((state) => state.user.id);
  const dispatch = useAppDispatch();
  const { boardID } = useParams();

  React.useEffect(() => {
    if (userID) {
      const fetchUsersTodos = async () => {
        const db = getDatabase(app);
        const userRef = ref(db, `users/${userID}/boards/${boardID}/boardData`);

        onValue(
          userRef,
          (snapshot) => {
            console.log(snapshot);
            if (snapshot.exists()) {
              setTodos(snapshot.val());
              console.log(snapshot.val());
            }
          },
          (error) => {
            dispatch(
              createAlert({
                alertTitle: "Error!",
                alertText: "Fetching data failed",
                alertError: true,
              })
            );
          }
        );
        // await get(userRef)
        //   .then((snapshot) => {
        //     if (snapshot.exists()) {
        //       setTodos(snapshot.val());
        //       console.log(snapshot.val());
        //     }
        //   })
        //   .catch((error) => {
        //     dispatch(
        //       createAlert({
        //         alertTitle: "Error!",
        //         alertText: "Fetching data failed",
        //         alertError: true,
        //       })
        //     );
        //   });
      };
      fetchUsersTodos();
    }
  }, [userID, dispatch, boardID]);

  return <Board todos={todos} boardID={boardID} guest={false} />;
};

export default BoardPage;
