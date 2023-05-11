import React from "react";
import styles from "./Board.module.scss";

import AddNewColumn from "./AddNewColumn";
import AddNewColumnItem from "./AddNewColumnItem";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import ThreeDots from "./ThreeDots/ThreeDots";
import AddNewBoard from "./BoardsList/AddNewBoard";
import {
  getBoardImg,
  setCurrentBoardID,
  updateBoard,
} from "../../store/slices/boards-slice";
import BoardMembers from "./BoardMembers/BoardMembers";
import SmallBoardList from "./SmallBoardList/SmallBoardList";

export interface dataI {
  title: string;
  items: string[];
  // [key:string]:any
}

interface drag {
  (
    e: React.DragEvent<HTMLDivElement>,
    groupIndex: number,
    groupItemIndex: number
  ): void;
}
interface dragItem {
  groupIndex: number;
  groupItemIndex: number;
}
interface backgroundStyle {
  [key: string]: string;
}

interface props {
  todos: dataI[];
  boardID: string | undefined;
  guest: boolean;
  guestBoardPHOTO?: string;
}

const Board: React.FC<props> = ({ todos, boardID, guest, guestBoardPHOTO }) => {
  const userID = useAppSelector((state) => state.user.id);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (userID) {
      setList(todos);
      dispatch(setCurrentBoardID(boardID));
      if (!guest) dispatch(getBoardImg());
    } else {
      setList([]);
    }
  }, [todos, userID, boardID, dispatch, guest]);

  const [list, setList] = React.useState(todos);
  // console.log(list);
  const [dragging, setDragging] = React.useState(false);

  const dragItem = React.useRef<dragItem | null>();
  const dragNode = React.useRef<any>();

  const handleDragStart: drag = (e, groupIndex, groupItemIndex) => {
    dragItem.current = { groupIndex, groupItemIndex };
    dragNode.current = e.target;
    dragNode.current.addEventListener("dragend", handleDragEnd);
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  function handleDragEnd() {
    setDragging(false);
    dragNode.current.removeEventListener("dragend", handleDragEnd);
    dragItem.current = null;
    dragNode.current = null;
  }
  // React.useEffect(() => {
  //   if (boardID && list.length > 0)
  //     dispatch(updateBoard({ data: list, boardID: boardID, guest: guest }));
  // }, [list, dispatch, boardID, guest]);

  const handleDragEnter: drag = (e, groupIndex, groupItemIndex) => {
    const currentItem = dragItem.current;
    if (
      groupItemIndex !== dragItem.current?.groupItemIndex ||
      groupIndex !== dragItem.current?.groupIndex
    ) {
      setList((oldList) => {
        let newList: dataI[] = JSON.parse(JSON.stringify(oldList));
        if (currentItem) {
          newList[groupIndex].items.splice(
            groupItemIndex,
            0,
            newList[currentItem.groupIndex].items.splice(
              currentItem.groupItemIndex,
              1
            )[0]
          );
        }
        dragItem.current = { groupIndex, groupItemIndex };
        if (boardID) {
        }
        // dispatch(
        //   updateBoard({ data: newList, boardID: boardID, guest: guest })
        // );
        return newList;
      });
    }
  };

  function getStyles(groupIndex: number, groupItemIndex: number) {
    const currentItem = dragItem.current;
    if (
      currentItem?.groupIndex === groupIndex &&
      currentItem.groupItemIndex === groupItemIndex
    ) {
      return `${styles["board__group__item--dragging"]} ${
        styles[`board__group__item`]
      }`;
    } else {
      return styles[`board__group__item`];
    }
  }

  function getNewList(newList: dataI) {
    setList([...list, newList]);
    if (userID && boardID)
      dispatch(
        updateBoard({
          data: [...list, newList],
          boardID: boardID,
          guest: guest,
        })
      );
  }

  function getNewListItem(newItem: string, index: number) {
    setList((prev) => {
      let newList: dataI[] = JSON.parse(JSON.stringify(prev));
      newList[index].items
        ? newList[index].items.push(newItem)
        : (newList[index].items = [newItem]);
      if (userID && boardID)
        dispatch(
          updateBoard({ data: newList, boardID: boardID, guest: guest })
        );
      return newList;
    });
  }

  function handleRemoveItem(groupIndex: number, groupItemIndex: number) {
    const newList: dataI[] = JSON.parse(JSON.stringify(list));
    newList[groupIndex].items.splice(groupItemIndex, 1);
    if (userID && boardID)
      dispatch(updateBoard({ data: newList, boardID: boardID, guest: guest }));
  }

  const theme = useAppSelector((state) => state.theme.theme);
  const customBG = useAppSelector((state) => state.boards.currentBoardIMG);
  let backgroundImageStyle: backgroundStyle = {
    position: "relative",
  };
  if (customBG || guestBoardPHOTO) {
    backgroundImageStyle.backgroundImage = `url(${
      customBG ? customBG : guestBoardPHOTO
    })`;
    backgroundImageStyle.backgroundPosition = "center";
    backgroundImageStyle.backgroundRepeat = "no-repeat";
    backgroundImageStyle.backgroundSize = "cover";
    backgroundImageStyle.height = "120vh";
  }
  return (
    <div style={backgroundImageStyle} className={styles["board__wrapper"]}>
      <div>
        <AddNewBoard />
        <SmallBoardList />
      </div>

      <SimpleBar className={styles["board__scrollbar"]}>
        {guest && <div></div>}
        <div className={styles["board"]}>
          {list.length > 0 &&
            list.map((group, groupIndex) => (
              <SimpleBar style={{ maxHeight: "70vh" }} key={groupIndex}>
                <div
                  onDragEnter={
                    dragging && !group.items?.length
                      ? (e) => {
                          handleDragEnter(e, groupIndex, 0);
                        }
                      : undefined
                  }
                  onDragEnd={() => {
                    setDragging(false);
                  }}
                  key={groupIndex}
                  className={styles["board__group"]}
                  list-theme={theme}
                >
                  <div className={styles["board__group__title"]}>
                    {group.title}
                  </div>
                  {group.items?.map((groupItem, groupItemIndex) => (
                    <div
                      onDragStart={(e) => {
                        handleDragStart(e, groupIndex, groupItemIndex);
                      }}
                      onDragEnter={(e) => {
                        handleDragEnter(e, groupIndex, groupItemIndex);
                      }}
                      key={groupItemIndex}
                      draggable
                      className={
                        dragging
                          ? getStyles(groupIndex, groupItemIndex)
                          : styles[`board__group__item`]
                      }
                    >
                      {groupItem}
                      <span
                        onClick={() => {
                          handleRemoveItem(groupIndex, groupItemIndex);
                        }}
                        className={styles["board__group__item__delete-btn"]}
                      >
                        &times;
                      </span>
                    </div>
                  ))}
                  <AddNewColumnItem
                    index={groupIndex}
                    getNewListItem={getNewListItem}
                  />
                </div>
              </SimpleBar>
            ))}
          <AddNewColumn getNewList={getNewList} />
        </div>
      </SimpleBar>

      <BoardMembers guest={guest} />
      {!guest && <ThreeDots setList={setList} />}
    </div>
  );
};

export default Board;
