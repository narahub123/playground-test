import { useEffect, useRef } from "react";
import styles from "./TextEditor.module.css";
import {
  createHashtag,
  createNewLine,
  isHashtag,
  isMention,
  isURL,
  movedown,
  moveLeft,
  moveRight,
  moveup,
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

    // 자식 요소 확인하기
    const lastChild = target.lastElementChild as HTMLElement;
    console.log("클릭한 요소의 마지막 child", lastChild);

    // 마지막 요소에 focus 주기
    lastChild.focus();
  };

  // 키보드 이벤트
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const key = e.key;
    console.log("눌린 키", key);

    if (key === "Enter") {
      createNewLine(e);
    } else if (key === "ArrowDown") {
      movedown(e);
    } else if (key === "ArrowUp") {
      moveup(e);
    } else if (key === "ArrowLeft") {
      moveLeft(e);
    } else if (key === "ArrowRight") {
      moveRight(e);
    } else if (key === "#") {
      isHashtag(e);
    } else if (key === "@") {
      isMention(e);
    } else if (key === ".") {
      isURL(e);
    }
  };

  // input 이벤트
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const innerText = e.currentTarget.innerText;
    // const innerHTML = e.currentTarget.innerHTML;
    console.log("텍스트", innerText);
    // console.log("html", innerHTML);
  };

  const vaildHashtag = /#([\p{L}\p{N}_]+)/gu;

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
            className={`${styles.span} ${styles.start}`}
            contentEditable
          ></span>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
