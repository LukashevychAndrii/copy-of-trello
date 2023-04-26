import React from "react";
import styles from "./Board.module.scss";

import AddNewColumn from "./AddNewColumn";

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

const Board = () => {
  const data: dataI[] = [{ title: "1", items: ["1"] }];

  const [list, setList] = React.useState(data);
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
  }

  return (
    <div className={styles["board"]}>
      {list.length > 0 &&
        list.map((group, groupIndex) => (
          <div
            onDragEnter={
              dragging && !group.items.length
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
          >
            <div className={styles["board__group__title"]}>{group.title}</div>
            {group.items.map((groupItem, groupItemIndex) => (
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
          </div>
        ))}
      <AddNewColumn getNewList={getNewList} />
    </div>
  );
};

export default Board;
