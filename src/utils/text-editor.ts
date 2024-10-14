import styles from "../pages/TextEditor/TextEditor.module.css";

export const createNewLine = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault(); // keydown 이벤트 전체에 적용하면 f5같은 기능이 먹히지 않음 주의할 것

  // 현재 선택된 요소 찾기
  const selection = window.getSelection();

  if (!selection) return;

  // 현재 커서가 있는 span
  const focusNode = selection.focusNode;
  console.log("현재 선택된 요소", focusNode);

  if (!focusNode) return;
  // 현재 커서가 있는 span의 부모 요소
  const parent = focusNode.parentElement;
  console.log("현재 선택된 요소의 부모 요소 ", parent);

  const div = document.createElement("div");
  div.setAttribute("class", styles.line);

  const span = document.createElement("span");
  span.setAttribute("class", styles.span);
  span.setAttribute("contentEditable", "true");

  div.appendChild(span);

  // 현재 선택된 요소의 다음에 새로운 라인 생성
  parent?.after(div);

  span.focus();
};
