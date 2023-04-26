import React from "react";
import Board from "../components/Board/Board";
import { getDatabase, ref, get } from "firebase/database";
import { app } from "../firebase";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { createAlert } from "../store/slices/alert-slice";

const BoardPage = () => {
  const [todos, setTodos] = React.useState([]);
  const userID = useAppSelector((state) => state.user.id);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (userID) {
      const fetchUsersTodos = async () => {
        const db = getDatabase(app);
        const userRef = ref(db, `users/${userID}/todos`);
        await get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              setTodos(snapshot.val());
              console.log(snapshot.val());
            }
          })
          .catch((error) => {
            dispatch(
              createAlert({
                alertTitle: "Error!",
                alertText: "Fetching data failed",
                alertError: true,
              })
            );
          });
      };
      fetchUsersTodos();
    }
  }, [userID, dispatch]);

  return <Board todos={todos} />;
};

export default BoardPage;
