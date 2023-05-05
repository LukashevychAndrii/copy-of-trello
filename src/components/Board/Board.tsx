import React from "react";
import styles from "./Board.module.scss";

import AddNewColumn from "./AddNewColumn";
import AddNewColumnItem from "./AddNewColumnItem";
import { getDatabase, ref, set } from "firebase/database";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { createAlert } from "../../store/slices/alert-slice";
import getErrorDetails from "../../utils/getErrorDetails";
import { AppDispatch } from "../../store";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import ThreeDots from "./ThreeDots/ThreeDots";
import AddNewBoard from "./BoardsList/AddNewBoard";
import {
  setCurrentBoardID,
  updateBoard,
} from "../../store/slices/boards-slice";

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

const Board: React.FC<{ todos: dataI[]; boardID: string | undefined }> = ({
  todos,
  boardID,
}) => {
  const userID = useAppSelector((state) => state.user.id);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (userID) {
      setList(todos);
      dispatch(setCurrentBoardID(boardID));
    } else {
      setList([]);
    }
  }, [todos, userID, boardID, dispatch]);

  const [list, setList] = React.useState(todos);
  console.log(list);
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
      dispatch(updateBoard({ data: [...list, newList], boardID: boardID }));
  }

  function getNewListItem(newItem: string, index: number) {
    setList((prev) => {
      let newList: dataI[] = [...prev];
      console.log(newList[index].items);
      newList[index].items
        ? newList[index].items.push(newItem)
        : (newList[index].items = [newItem]);
      if (userID && boardID)
        dispatch(updateBoard({ data: newList, boardID: boardID }));
      return newList;
    });
  }

  const theme = useAppSelector((state) => state.theme.theme);
  const customBG = useAppSelector((state) => state.user.boardImg);
  let backgroundImageStyle: backgroundStyle = {
    position: "relative",
  };
  if (customBG) {
    backgroundImageStyle.backgroundImage = `url(${customBG})`;
    backgroundImageStyle.backgroundPosition = "center";
    backgroundImageStyle.backgroundRepeat = "no-repeat";
    backgroundImageStyle.backgroundSize = "cover";
    backgroundImageStyle.height = "120vh";
  }
  return (
    <div style={backgroundImageStyle}>
      <div className={styles["add-new-board__wrapper"]}>
        <AddNewBoard />
      </div>
      <SimpleBar style={{ maxWidth: "80vw", margin: "auto" }} forceVisible="x">
        <div className={styles["board"]}>
          {list.length > 0 &&
            list.map((group, groupIndex) => (
              <SimpleBar
                style={{ maxHeight: "80vh" }}
                forceVisible="y"
                key={groupIndex}
              >
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
      <ThreeDots />
    </div>
  );
};

export default Board;
