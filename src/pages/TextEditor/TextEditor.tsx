import styles from "./TextEditor.module.css";

const TextEditor = () => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 클릭한 요소
    const target = e.target as HTMLElement;
    console.log("클릭한 요소", target);
    // 클릭한 요소의 클래스 이름
    const className = target.className;

    // line 클래스를 클릭한 경우
    if (className.includes("line")) {
      console.log("line 클래스를 클릭함");
      // 해당 클래스 내의 가장 마지막 요소의 마지막 위치에 커서를 위치함
      const lastChild = target.lastElementChild?.children[0];
      const lastChildText = lastChild?.textContent || "";
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
