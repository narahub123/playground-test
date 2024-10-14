import { useEffect } from "react";
import styles from "./TextEditor.module.css";

const TextEditor = () => {
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
  return (
    <div className="texteditor">
      <div className={styles.content}>
        <div className={styles.line} onClick={(e) => handleClick(e)}>
          <span className={styles.span} contentEditable></span>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
