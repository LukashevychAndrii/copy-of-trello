import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchGuestBoard } from "../store/slices/boards-slice";
import Board, { dataI } from "../components/Board/Board";

const GuestBoardsPage = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [todos, setTodos] = React.useState<dataI[]>();

  React.useEffect(() => {
    if (params.guestBoardID) {
      dispatch(
        fetchGuestBoard({ boardID: params.guestBoardID, navigate: navigate })
      );
    }
  }, [dispatch, params, navigate]);

  const guestBoard = useAppSelector((state) => state.boards.currentGuestBoard);
  console.log(guestBoard);

  React.useEffect(() => {
    setTodos(guestBoard?.boardDATA.boardData);
  }, [guestBoard]);

  return (
    <div>
      <Board
        todos={todos ? todos : []}
        boardID={params.guestBoardID}
        guestBoardPHOTO={guestBoard?.boardPhoto}
        guest={true}
      />
    </div>
  );
};

export default GuestBoardsPage;
