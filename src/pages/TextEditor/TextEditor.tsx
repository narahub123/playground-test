import styles from "./TextEditor.module.css";

const TextEditor = () => {
  return (
    <div className="text-editor">
      <div className={styles.content}>
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
