import {
  moveDown,
  moveLeft,
  moveRight,
  moveUp,
  setCursorPosition,
} from "../../utils/text-editor";
import styles from "./TextEditor.module.css";

const TextEditor = () => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target;
    console.log("클릭한 요소", target);

    const className = (target as HTMLElement).className;

    // 클릭한 요소가 줄인 경우
    if (className.includes("line")) {
      // 줄의 마지막 요소의 마지막
      const lastChild = (target as HTMLElement).lastElementChild
        ?.children[0] as HTMLElement;
      if (!lastChild) return;

      const text = lastChild?.textContent || "";

      setCursorPosition(lastChild, text.length);
    }
    // 클릭한 요소가 link인 경우 이전 요소로 이동
    if (className.includes("link")) {
      const selection = window.getSelection();
      if (!selection) return;

      const prev = (target as HTMLElement).parentElement
        ?.previousElementSibling;

      // 이전 요소가 있다면
      if (prev && selection.focusOffset === 0) {
        const prevText = prev.textContent || "";

        setCursorPosition(prev.firstChild, prevText.length);
      }
    }
  };

  // key down 이벤트
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const key = e.key;

    // shift 키를 누르면서
    if (e.shiftKey) {
      const selection = getSelection();
      if (!selection) return;
      if (key === "ArrowRight") {
      }
    } else if (key === "ArrowRight") {
      moveRight(e);
    } else if (key === "ArrowLeft") {
      moveLeft(e);
    } else if (key === "ArrowUp") {
      moveUp(e);
    } else if (key === "ArrowDown") {
      moveDown(e);
    }
  };
  return (
    <div className="text-editor">
      <div
        className={styles.content}
        onClick={(e) => handleClick(e)}
        onKeyDown={(e) => handleKeyDown(e)}
      >
        <div className={styles.line}>
          {/* 선택 영역 지정을 위해서 span을 이중으로 설계해야 함 */}
          <span className={`${styles.container}`}>
            <span className={styles.span} contentEditable></span>
          </span>
          <span className={`${styles.container}`}>
            <span className={styles.link} contentEditable></span>
          </span>
        </div>
        <div className={styles.line}>
          {/* 선택 영역 지정을 위해서 span을 이중으로 설계해야 함 */}
          <span className={`${styles.container}`}>
            <span className={styles.span} contentEditable></span>
          </span>
          <span className={`${styles.container}`}>
            <span className={styles.link} contentEditable></span>
          </span>
          <span className={`${styles.container}`}>
            <span
              className={`${styles.span} ${styles.gap}`}
              contentEditable
            ></span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
