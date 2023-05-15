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
  const [guestBoardID, setGuestBoardID] = React.useState<string | undefined>(
    ""
  );
  React.useEffect(() => {
    setGuestBoardID(params.guestBoardID);
  }, [guestBoardID, params]);
  const guestsBoards = useAppSelector((state) => state.boards.guestsBoards);
  React.useEffect(() => {
    if (guestBoardID && guestsBoards) {
      dispatch(fetchGuestBoard({ boardID: guestBoardID, navigate: navigate }));
    }
  }, [dispatch, navigate, guestBoardID, guestsBoards]);

  const guestBoard = useAppSelector((state) => state.boards.currentGuestBoard);

  React.useEffect(() => {
    if (guestBoard?.boardDATA.boardData) {
      const boardDATA: dataI[] = guestBoard.boardDATA.boardData;

      const transformedTodos = boardDATA.map((el) =>
        el.items ? el : { title: el.title, items: [] }
      );

      setTodos(transformedTodos);
    }
  }, [guestBoard]);

  return (
    <div>
      <div>{guestBoard?.boardDATA.boardName}</div>
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
