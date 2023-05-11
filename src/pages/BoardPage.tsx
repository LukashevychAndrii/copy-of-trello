import React from "react";
import Board, { dataI } from "../components/Board/Board";
import { getDatabase, ref, get, onValue } from "firebase/database";
import { app } from "../firebase";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { createAlert } from "../store/slices/alert-slice";
import { useParams } from "react-router-dom";
import { setCurrentGuestBoard } from "../store/slices/boards-slice";

const BoardPage = () => {
  const [todos, setTodos] = React.useState<dataI[]>([]);
  const userID = useAppSelector((state) => state.user.id);
  const dispatch = useAppDispatch();
  const { boardID } = useParams();
  React.useEffect(() => {
    dispatch(setCurrentGuestBoard(undefined));
  }, [dispatch]);

  React.useEffect(() => {
    if (userID) {
      const fetchUsersTodos = async () => {
        const db = getDatabase(app);
        const userRef = ref(db, `users/${userID}/boards/${boardID}/boardData`);

        onValue(
          userRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const todos: dataI[] = snapshot.val();
              const transformedTodos = todos.map((el) =>
                el.items ? el : { title: el.title, items: [] }
              );
              setTodos(transformedTodos);
            } else {
              setTodos([]);
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
