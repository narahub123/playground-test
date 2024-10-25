import {
  checkValidLink,
  getCurElement,
  setCursorPosition,
} from "./text-editor";
import styles from "../../pages/TextEditor/TextEditor.module.css";
import { validClass } from "../../data";

// 다음 줄 생성하기
const createNewLine = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault(); // keydown 이벤트 전체에 적용하면 f5같은 기능이 먹히지 않음 주의할 것

  const { curElem, curText, curPosition, curLine, nextElem } = getCurElement();

  let newText = "";
  let addedElems: HTMLElement[] = [];

  // 현재 위치에 있을 문자열
  const remainedText = curText.slice(0, curPosition);

  curElem.innerText = remainedText;

  // 이동할 문자열
  newText = curText.slice(curPosition);

  // 다음 요소가 존재하는 경우
  if (nextElem) {
    // 현재 줄의 자식 요소들
    const childSpan = [...curLine.children] as HTMLElement[];

    // 현재 요소의 위치
    const indexOfCurElem = childSpan.indexOf(curElem);
    console.log("현재 요소의 위치", indexOfCurElem);
    // 이동 할 자식 요소들
    addedElems = childSpan.slice(indexOfCurElem + 1);
  }

  const div = document.createElement("div");
  div.setAttribute("class", styles.line);

  const span = document.createElement("span");
  span.setAttribute("class", `${styles.span} ${styles.normal}`);
  span.setAttribute("contentEditable", "true");

  div.appendChild(span);

  // 현재 선택된 요소의 다음에 새로운 라인 생성
  curLine?.after(div);

  for (let i = 0; i < addedElems.length; i++) {
    // 추가될 요소
    const addedElem = addedElems[i];

    // 첫번째 요소인 경우
    if (i === 0) {
      // 첫번째 요소가 span 클래스인 경우
      if (addedElem.className.includes("span")) {
        const text = addedElem?.textContent || "";
        newText += addedElem.className.includes("gap") ? " " : "" + text;

        addedElem.remove();
      }
    }

    console.log(addedElem);

    span.after(addedElem);
  }

  span.innerText = newText;
  setCursorPosition(span, 0);
};

// normal span 클래스 생성
const createNormalSpan = (container: HTMLElement, text: string = "") => {
  const span = document.createElement("span");
  span.setAttribute("class", `${styles.span} ${styles.normal}`);
  span.setAttribute("contentEditable", "true");
  span.innerText = text;

  container.after(span);

  return span;
};

// gap span 클래스 생성
const createGapSpan = (container: HTMLElement, text: string = "") => {
  const span = document.createElement("span");
  span.setAttribute("class", `${styles.span} ${styles.gap}`);
  span.setAttribute("contentEditable", "true");
  span.innerText = text;

  container.after(span);

  return span;
};

// link 클래스 생성
const createLinkClass = (
  container: HTMLElement,
  text: string,
  className: string
) => {
  const classname =
    className === "mention"
      ? styles.mention
      : className === "hashtag"
      ? styles.hashtag
      : className === "url"
      ? styles.url
      : "";

  const span = document.createElement("span");
  span.setAttribute("class", `${styles.link} ${classname}`);
  span.setAttribute("contentEditable", "true");

  span.innerText = text;

  // onInput 이벤트 핸들러 추가
  span.addEventListener("input", () => checkValidLink());

  container.after(span);

  return span;
};

// selected span 생성하기
const createSelectedSpan = (container: HTMLElement, text: string) => {
  const span = document.createElement("span");

  const classname = container.getAttribute("class");
  const classNames = (classname?.match(validClass) as string[]).map((c) => {
    if (c === "gap") return "normal";
    else return c;
  });

  console.log(classNames);

  span.setAttribute(
    "class",
    `${styles[classNames[0]]} ${styles[classNames[1]]} ${styles.selected}`
  );
  span.setAttribute("contentEditable", "true");
  span.innerText = text;

  return span;
};

export {
  createGapSpan,
  createLinkClass,
  createNewLine,
  createNormalSpan,
  createSelectedSpan,
};
