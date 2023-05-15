import React from "react";
import styles from "./Board.module.scss";
import "./AddBorderRadius.scss";
import { ReactComponent as PencilIcon } from "../../img/SVG/pencil.svg";
import { ReactComponent as Checkmark } from "../../img/SVG/checkmark.svg";

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
import { createAlert } from "../../store/slices/alert-slice";
import { useNavigate } from "react-router-dom";

export interface dataI {
  title: string;
  items: string[];
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
  const [newTitle, setNewTitle] = React.useState("");
  const [titleIndex, setTitleIndex] = React.useState(-1);
  const [newItemText, setNewItemItext] = React.useState("");
  const [titleIndex2, setTitleIndex2] = React.useState(-1);
  const [itemIndex, setItemIndex] = React.useState(-1);

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
  const [dragging, setDragging] = React.useState(false);

  const dragItem = React.useRef<dragItem | null>();
  const dragNode = React.useRef<any>();

  const navigate = useNavigate();

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
        if (boardID) {
          dispatch(
            updateBoard({
              data: newList,
              boardID: boardID,
              guest: guest,
              navigate: navigate,
            })
          );
        }
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
          navigate: navigate,
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
          updateBoard({
            data: newList,
            boardID: boardID,
            guest: guest,
            navigate: navigate,
          })
        );
      return newList;
    });
  }

  function handleRemoveItem(groupIndex: number, groupItemIndex: number) {
    const newList: dataI[] = JSON.parse(JSON.stringify(list));
    newList[groupIndex].items.splice(groupItemIndex, 1);
    if (userID && boardID)
      dispatch(
        updateBoard({
          data: newList,
          boardID: boardID,
          guest: guest,
          navigate: navigate,
        })
      );
  }
  function handleRemoveColumn(groupIndex: number) {
    const newList: dataI[] = JSON.parse(JSON.stringify(list));
    newList.splice(groupIndex, 1);
    if (userID && boardID)
      dispatch(
        updateBoard({
          data: newList,
          boardID: boardID,
          guest: guest,
          navigate: navigate,
        })
      );
  }

  function handleChangeTitle(groupIndex: number) {
    if (newTitle.trim().length > 10) {
      dispatch(
        createAlert({
          alertTitle: "Error!",
          alertText: "Max length of title is 10!",
          alertError: true,
        })
      );
    } else if (newTitle.trim().length > 0) {
      const newList: dataI[] = JSON.parse(JSON.stringify(list));
      newList[groupIndex].title = newTitle;
      if (userID && boardID)
        dispatch(
          updateBoard({
            data: newList,
            boardID: boardID,
            guest: guest,
            navigate: navigate,
          })
        );
      setTitleIndex(-1);
    } else {
      dispatch(
        createAlert({
          alertTitle: "Error!",
          alertText: "Title must not be empty!",
          alertError: true,
        })
      );
    }
  }
  const titleRef = React.useRef(null);
  const itemRef = React.useRef(null);
  function useHandleClickOutside(dropAreaRef: any) {
    React.useEffect(() => {
      function handleClickOutside(event: any) {
        if (
          dropAreaRef.current &&
          !dropAreaRef.current.contains(event.target)
        ) {
          setTitleIndex(-1);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [dropAreaRef]);
  }
  useHandleClickOutside(titleRef);

  function handleItemTextChange(groupIndex: number, groupItemIndex: number) {
    if (newItemText.trim().length > 50) {
      dispatch(
        createAlert({
          alertTitle: "Error!",
          alertText: "Max length of column item is 50!",
          alertError: true,
        })
      );
      setTitleIndex2(-1);
      setItemIndex(-1);
    } else if (newItemText.trim().length > 0) {
      const newList: dataI[] = JSON.parse(JSON.stringify(list));
      newList[groupIndex].items[groupItemIndex] = newItemText;
      if (userID && boardID)
        dispatch(
          updateBoard({
            data: newList,
            boardID: boardID,
            guest: guest,
            navigate: navigate,
          })
        );
      setItemIndex(-1);
    } else {
      dispatch(
        createAlert({
          alertTitle: "Error!",
          alertText: "Text area must not be empty!",
          alertError: true,
        })
      );
    }
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
      <div className={styles["board__left-bar"]}>
        <AddNewBoard />
        <SmallBoardList />
      </div>
      <div>
        {list.length > 0}

        <SimpleBar className={styles["board__scrollbar"]}>
          <div className={styles["board"]}>
            {list.length > 0 &&
              list.map((group, groupIndex) => (
                <SimpleBar
                  className={styles["board__group__scrollbar"]}
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
                    {titleIndex === groupIndex ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleChangeTitle(groupIndex);
                        }}
                        className={styles["board__group__title__new-title"]}
                        ref={titleRef}
                      >
                        <input
                          id={`new-title-text__${groupIndex}`}
                          name="new-title-text"
                          type="text"
                          value={newTitle}
                          onChange={(e) => {
                            setNewTitle(e.target.value);
                          }}
                        />
                        <label
                          htmlFor={`new-title-text__${groupIndex}`}
                        ></label>
                        <div
                          className={styles["board__group__new-title-buttons"]}
                        >
                          <Checkmark
                            className={styles["board__group__checkmark"]}
                            onClick={() => {
                              handleChangeTitle(groupIndex);
                            }}
                          />
                          <span
                            className={
                              styles[
                                "board__group__new-title-buttons__delete-btn"
                              ]
                            }
                            onClick={() => {
                              setTitleIndex(-1);
                            }}
                          >
                            &times;
                          </span>
                        </div>
                      </form>
                    ) : (
                      <div className={styles["board__group__title-wrapper"]}>
                        <div className={styles["board__group__title"]}>
                          {group.title}
                        </div>
                        <PencilIcon
                          className={styles["board__group__title__pencil-icon"]}
                          onClick={() => {
                            setTitleIndex(groupIndex);
                            setNewTitle(group.title);
                          }}
                        />
                        <span
                          onClick={() => {
                            handleRemoveColumn(groupIndex);
                          }}
                          className={styles["board__group__title__delete-btn"]}
                        >
                          &times;
                        </span>
                      </div>
                    )}
                    {group.items?.map((groupItem, groupItemIndex) => (
                      <div ref={itemRef} key={groupItemIndex}>
                        {itemIndex === groupItemIndex &&
                        titleIndex2 === groupIndex ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleItemTextChange(groupIndex, groupItemIndex);
                            }}
                            className={styles["board__group__title__new-title"]}
                            ref={titleRef}
                          >
                            <input
                              type="text"
                              id={`new-item-text__${groupIndex}-${groupItemIndex}`}
                              name={`new-item-text__${groupIndex}-${groupItemIndex}`}
                              value={newItemText}
                              onChange={(e) => {
                                setNewItemItext(e.target.value);
                              }}
                            />
                            <label
                              htmlFor={`new-item-text__${groupIndex}-${groupItemIndex}`}
                            ></label>
                            <div
                              className={
                                styles["board__group__new-title-buttons"]
                              }
                            >
                              <Checkmark
                                className={styles["board__group__checkmark"]}
                                onClick={() => {
                                  handleItemTextChange(
                                    groupIndex,
                                    groupItemIndex
                                  );
                                }}
                              />
                              <span
                                className={
                                  styles[
                                    "board__group__new-title-buttons__delete-btn"
                                  ]
                                }
                                onClick={() => {
                                  setTitleIndex2(-1);
                                  setItemIndex(-1);
                                }}
                              >
                                &times;
                              </span>
                            </div>
                          </form>
                        ) : (
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
                            <div style={{ width: "85%" }}>{groupItem}</div>
                            <div
                              className={styles["board__group__item__buttons"]}
                            >
                              <span
                                onClick={() => {
                                  handleRemoveItem(groupIndex, groupItemIndex);
                                }}
                                className={
                                  styles["board__group__item__delete-btn"]
                                }
                              >
                                &times;
                              </span>
                              <PencilIcon
                                className={
                                  styles["board__group__item__pencil-icon"]
                                }
                                onClick={() => {
                                  setItemIndex(groupItemIndex);
                                  setTitleIndex2(groupIndex);
                                  setNewItemItext(groupItem);
                                }}
                              />
                            </div>
                          </div>
                        )}
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
      </div>

      <BoardMembers guest={guest} />
      {!guest && <ThreeDots setList={setList} />}
    </div>
  );
};

export default Board;
