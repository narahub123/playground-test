import { useState } from "react";
import {
  moveDown,
  moveLeft,
  moveRight,
  moveStart,
  moveEnd,
  moveUp,
  setCursorPosition,
  movePageUp,
  movePageDown,
  selectRight,
  selectLeft,
  selectDown,
  selectUp,
  selectStart,
  selectEnd,
  selectPageUp,
  selectPageDown,
  hasLink,
  checkValidLink,
  getCurElement,
} from "../../utils/text-editor";
import styles from "./TextEditor.module.css";

const TextEditor = () => {
  const [direction, setDirection] = useState<string>("");
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 클릭한 요소
    const target = e.target as HTMLElement;
    console.log("클릭한 요소", target);

    const selection = window.getSelection();
    if (!selection) return;

    // 현재 커서 위치
    const currentPosition = selection.focusOffset;

    // 클릭한 요소의 클래스 이름
    const className = target.className;

    // 하단의 조건에 만족하지 않는다면 현재 클래스의 현재 위치에 커서 지정
    let cursorElement = target;
    let cursorPosition = currentPosition;

    // 선택 초기화 코드 필요함

    // line 클래스를 클릭한 경우
    if (className.includes("line")) {
      console.log("line 클래스를 클릭함");
      // 해당 클래스 내의 가장 마지막 요소의 마지막 위치에 커서를 위치함
      const lastChild = target.lastElementChild as HTMLElement;
      // 마지막 요소의 텍스트
      const lastChildText = lastChild?.textContent || "";

      // 마지막 요소의 마지막 위치에 커서 지정
      cursorElement = lastChild;
      cursorPosition = lastChildText.length;
    } else if (className.includes("link") && currentPosition === 0) {
      // link 클래스를 클릭했고 현재 커서의 위치가 0인 경우
      console.log("link 클래스 0 포인트 클릭");
      const curContainer = target.parentElement;
      // 이전 컨테이너
      const prevContainer = curContainer?.previousElementSibling as HTMLElement;
      const prevElem = prevContainer?.firstElementChild as HTMLElement;
      const prevText = prevElem?.textContent || "";
      if (prevElem) {
        // 이전 요소가 존재하는 경우 이전 요소의 마지막으로 커서 이동
        console.log("이전 요소가 존재하는 경우");

        cursorElement = prevElem;
        cursorPosition = prevText.length;
      }
    }

    setCursorPosition(cursorElement, cursorPosition);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const key = e.key;
    if (e.shiftKey) {
      if (key === "ArrowRight") {
        selectRight(e, direction, setDirection);
      } else if (key === "ArrowLeft") {
        selectLeft(e, direction, setDirection);
      } else if (key === "ArrowUp") {
        selectUp(e, direction, setDirection);
      } else if (key === "ArrowDown") {
        selectDown(e, direction, setDirection);
      } else if (key === "Home") {
        selectStart(e, direction, setDirection);
      } else if (key === "End") {
        selectEnd(e, direction, setDirection);
      } else if (key === "PageUp") {
        selectPageUp(e, setDirection);
      } else if (key === "PageDown") {
        selectPageDown(e, setDirection);
      }
    } else {
      setDirection("");
      if (key === "ArrowRight") {
        moveRight(e);
      } else if (key === "ArrowLeft") {
        moveLeft(e);
      } else if (key === "ArrowUp") {
        moveUp(e);
      } else if (key === "ArrowDown") {
        moveDown(e);
      } else if (key === "Home") {
        moveStart(e);
      } else if (key === "End") {
        moveEnd(e);
      } else if (key === "PageUp") {
        movePageUp(e);
      } else if (key === "PageDown") {
        movePageDown(e);
      }
    }
  };

  const handleInput = (e: React.FormEvent<HTMLSpanElement>) => {
    const { curClassName } = getCurElement();

    checkValidLink();

    hasLink();
  };
  return (
    <div className="text-editor">
      <div
        className={styles.content}
        onClick={(e) => handleClick(e)}
        onKeyDown={(e) => handleKeyDown(e)}
        onInput={(e) => handleInput(e)}
      >
        <div className={styles.line} data-line={0}>
          <span
            className={`${styles.span} ${styles.normal}`}
            contentEditable
          ></span>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
