import { useEffect, useRef } from "react";
import styles from "./TextEditor.module.css";
import {
  createNewLine,
  deleteByBackspace,
  getContainerElement,
  hasLink,
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
  setCursorPosition,
} from "../../utils";

const TextEditor = () => {
  const contentRef = useRef<HTMLDivElement>(null);

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
    // 클릭한 대상 파악하기
    const target = e.target as HTMLElement;
    console.log("클릭한 요소", target);

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
      const { container, cursorPos } = getContainerElement();
      if (!container) return;

      const content = container.parentElement?.parentElement;

      if (!content) return;
      console.log(content?.textContent);

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

      setCursorPosition(container, cursorPos);
    }
  };

  // 키보드 이벤트
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const key = e.key;
    console.log("눌린 키", key);

    if (e.ctrlKey) {
      if (key === "a") {
        e.preventDefault();
        const { container } = getContainerElement();
        if (!container) return;

        const content = container.parentElement?.parentElement;

        if (!content) return;
        console.log(content?.textContent);

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
      } else if (key === "ArrowRight") {
      }
    } else if (key === "Enter") {
      createNewLine(e);
    } else if (key === "ArrowDown") {
      movedown(e);
    } else if (key === "ArrowUp") {
      moveup(e);
    } else if (key === "ArrowLeft") {
      moveLeft(e);
    } else if (key === "ArrowRight") {
      moveRight(e);
    } else if (key === "Backspace") {
      deleteByBackspace(e);
    } else if (key === "Home") {
      moveStart(e);
    } else if (key === "End") {
      moveEnd(e);
    } else if (key === "PageUp") {
      movePageUp(e);
    } else if (key === "PageDown") {
      movePageDown(e);
    }
  };

  // input 이벤트
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const { container } = getContainerElement();

    if (!container) return;

    // 현재 요소가 span 클래스인지 여부 확인
    if (container.className.includes("span")) {
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
