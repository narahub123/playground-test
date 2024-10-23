import { useEffect, useRef, useState } from "react";
import styles from "./TextEditor.module.css";
import {
  createNewLine,
  deleteByBackspace,
  getCurElement,
  hasLink,
  initializeSelection,
  movedown,
  moveEnd,
  moveLeft,
  movePageDown,
  movePageUp,
  moveRight,
  moveStart,
  moveup,
  selectToEnd,
  selectToStart,
  selectWithArrowRight,
  selectWithPgDn,
  selectWithPgUp,
  setCursorPosition,
} from "../../utils";

const TextEditor = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(0);
  const [selectedText, setSelectedText] = useState("");

  // 삭제된 코드: focus 확인 용
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      console.log("포커스된 요소", document.activeElement);
    };

    const handleBlur = (e: FocusEvent) => {
      console.log("포커스에서 벗어난 요소", e.target);
    };

    // 포커스와 블러 이벤트를 전역에서 감지
    document.addEventListener("focusin", handleFocus);
    document.addEventListener("focusout", handleBlur);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("focusout", handleBlur);
    };
  }, []);

  // 줄 클릭시 가장 마지막 요소에 포커스 주기
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    // 클릭한 대상 파악하기
    const target = e.target as HTMLElement;

    console.log(target);

    initializeSelection(setStart, setSelectedText, contentRef);

    const className = target.className;

    // 줄을 클릭한 경우
    if (className.includes("line")) {
      // 자식 요소 확인하기
      const lastChild = target.lastElementChild as HTMLElement;
      console.log("클릭한 요소의 마지막 child", lastChild);

      // 마지막 요소에 focus 주기
      lastChild.focus();
    }

    // span 혹은 link를 클릭한 경우
    if (className.includes("span") || className.includes("link")) {
      const { curElem, curPosition } = getCurElement();
      if (!curElem) return;

      const content = curElem.parentElement?.parentElement;
      if (!content) return;

      const children = content.children;

      for (const child of children) {
        const grand = child.children;

        for (const grandChildren of grand) {
          const gc = grandChildren as HTMLElement;

          if (gc.className.includes("link")) {
            gc.style.background = "white";
            gc.style.color = "cornflowerblue";
          } else {
            gc.style.background = "white";
            gc.style.color = "black";
          }
        }
      }

      setCursorPosition(curElem, curPosition);
    }
  };

  // 키보드 이벤트
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const key = e.key;
    console.log("눌린 키", key);

    if (e.ctrlKey) {
      if (key === "a") {
        e.preventDefault();
        const { curElem } = getCurElement();
        if (!curElem) return;

        // 최상위 클래스
        const content = curElem.parentElement?.parentElement;
        if (!content) return;

        const children = content.children;

        for (const child of children) {
          const grand = child.children;

          for (const grandChildren of grand) {
            const gc = grandChildren as HTMLElement;
            gc.style.background = "cornflowerblue";
            gc.style.color = "white";
          }
        }

        const lastgrandChlid = content.lastChild?.lastChild as HTMLElement;

        if (!lastgrandChlid) return;

        const lastText = lastgrandChlid.textContent || "";
        setCursorPosition(lastgrandChlid, lastText.length);
      }
    } else if (e.shiftKey) {
      if (key === "End") {
        selectToEnd();
      } else if (key === "Home") {
        selectToStart();
      } else if (key === "PageUp") {
        selectWithPgUp();
      } else if (key === "PageDown") {
        selectWithPgDn();
      } else if (key === "ArrowRight") {
        selectWithArrowRight(e, start, setStart, selectedText, setSelectedText);
      }
    } else if (key === "Enter") {
      initializeSelection(setStart, setSelectedText, contentRef);
      createNewLine(e);
    } else if (key === "ArrowDown") {
      initializeSelection(setStart, setSelectedText, contentRef);
      movedown(e);
    } else if (key === "ArrowUp") {
      initializeSelection(setStart, setSelectedText, contentRef);
      moveup(e);
    } else if (key === "ArrowLeft") {
      initializeSelection(setStart, setSelectedText, contentRef);
      moveLeft(e);
    } else if (key === "ArrowRight") {
      initializeSelection(setStart, setSelectedText, contentRef);
      moveRight(e);
    } else if (key === "Backspace") {
      initializeSelection(setStart, setSelectedText, contentRef);
      deleteByBackspace(e);
    } else if (key === "Home") {
      initializeSelection(setStart, setSelectedText, contentRef);
      moveStart(e);
    } else if (key === "End") {
      initializeSelection(setStart, setSelectedText, contentRef);
      moveEnd(e);
    } else if (key === "PageUp") {
      initializeSelection(setStart, setSelectedText, contentRef);
      movePageUp(e);
    } else if (key === "PageDown") {
      initializeSelection(setStart, setSelectedText, contentRef);
      movePageDown(e);
    }
  };

  // input 이벤트
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const { curElem, curClassName } = getCurElement();
    if (!curElem) return;

    console.log(curClassName);

    // 현재 요소가 span 클래스인지 여부 확인
    if (curClassName?.includes("span")) {
      console.log("ㅗㅑ");

      hasLink();
    }
  };

  return (
    <div className="texteditor">
      <div
        className={styles.content}
        ref={contentRef}
        onClick={(e) => handleClick(e)}
        onInput={(e) => handleInput(e)}
        onKeyDown={(e) => handleKeyDown(e)}
      >
        <div className={styles.line}>
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
