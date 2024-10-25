import { setCursorPosition } from "../../utils/text-editor";
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
      console.log("마지막 요소", lastChild);
      const text = lastChild?.textContent || "";

      setCursorPosition(lastChild, text.length);
    }
  };

  return (
    <div className="text-editor">
      <div className={styles.content} onClick={(e) => handleClick(e)}>
        <div className={styles.line}>
          {/* 선택 영역 지정을 위해서 span을 이중으로 설계해야 함 */}
          <span className={`${styles.container}`}>
            <span className={styles.span} contentEditable></span>
          </span>
          <span className={`${styles.container}`}>
            <span className={styles.span} contentEditable></span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
