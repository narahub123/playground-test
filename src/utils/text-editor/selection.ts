import { validClass } from "../../data";
import { createSelectedSpan } from "./create";
import { getCurElement, setCursorPosition } from "./text-editor";
import styles from "../../pages/TextEditor/TextEditor.module.css";
import { moveToDifferentLine } from "./move";

// shift + End로 현재 줄 마지막까지 선택하기
const selectToEnd = () => {
  const { curElem, curText, curPosition, curLine } = getCurElement();
  if (!curElem) return;

  // 현재 요소에서 선택되지 않은 요소
  const unselectedText = curText.slice(0, curPosition);
  // 현재 요소에 삽입
  curElem.innerText = unselectedText;

  // 선택된 현재 문자열
  const selectedText = curText.slice(curPosition);

  // 현재 요소와 동일한 클래스를 가지고 있는 선택 span 생성
  const selectedSpan = createSelectedSpan(curElem, selectedText);

  // 선택 span 현재 요소의 자식요소로 추가
  curElem.appendChild(selectedSpan);

  // 현재 줄의 자식 요소 배열
  const children = [...curLine?.children] as HTMLElement[];

  // 현재 요소의 index 알아내기
  const index = children.indexOf(curElem);
  console.log("현재 요소의 위치", index);

  // 현재 요소를 이후의 자식 요소
  const selectedChildren = children.slice(index + 1);

  // 선택된 자식 요소에 selected 클래스 삽입하기
  for (const child of selectedChildren) {
    const className = child.getAttribute("class");

    const classNames = className?.match(validClass) as string[];

    // 기존 클래스에 selected 클래스 추가하기
    child.setAttribute(
      "class",
      `${styles[classNames[0]]} ${styles[classNames[1]]} ${styles.selected}`
    );
  }

  // 현재 줄의 마지막 자식 요소 및 해당 요소의 길이 알아내기(커서 위치 지정)
  const lastChild = curLine?.lastChild as HTMLElement;
  const lastText = lastChild?.textContent || "";

  setCursorPosition(lastChild, lastText.length);
};

// shift + Home으로 현재 줄 시작까지 선택하기
const selectToStart = () => {
  const { curElem, curText, curPosition } = getCurElement();
  if (!curElem) return;

  const line = curElem.parentElement;
  if (!line) return;

  // 현재 요소에서 선택되지 않은 요소
  const unselectedText = curText.slice(curPosition);
  // 현재 요소에 삽입
  curElem.innerText = unselectedText;

  // 선택된 현재 문자열
  const selectedText = curText.slice(0, curPosition);

  // 현재 요소와 동일한 클래스를 가지고 있는 선택 span 생성
  const selectedSpan = createSelectedSpan(curElem, selectedText);

  // 선택 span 현재 요소의 자식요소로 추가
  curElem.prepend(selectedSpan);

  // 현재 줄의 자식 요소 배열
  const children = [...line.children] as HTMLElement[];

  // 현재 요소의 index 알아내기
  const index = children.indexOf(curElem);

  // 현재 요소를 이후의 자식 요소
  const selectedChildren = children.slice(0, index);

  // 선택된 자식 요소에 selected 클래스 삽입하기
  for (const child of selectedChildren) {
    const className = child.getAttribute("class");

    const classNames = className?.match(validClass) as string[];

    // 기존 클래스에 selected 클래스 추가하기
    child.setAttribute(
      "class",
      `${styles[classNames[0]]} ${styles[classNames[1]]} ${styles.selected}`
    );
  }

  // 현재 줄의 마지막 자식 요소 및 해당 요소의 길이 알아내기(커서 위치 지정)
  const firstChild = line.lastChild as HTMLElement;

  setCursorPosition(firstChild, 0);
};

// shift + PgUp으로 문장 첫 번째 줄 현재 위치까지 선택하기
const selectWithPgUp = () => {
  const { curElem, curLine } = getCurElement();
  if (!curElem) return;

  // 에디터
  const content = curElem?.parentElement?.parentElement as HTMLElement;
  if (!content) return;

  // 에디터 내의 모든 줄
  const lines = [...content.children] as HTMLElement[];

  // 현재 줄의 위치
  const indexOfline = lines.indexOf(curLine);

  // 현 줄 이전의 줄 배열 -현재 첫째줄
  const selectedLines = lines.slice(1, indexOfline);

  // 선택된 줄들에 selected 클래스 추가하기
  for (const line of selectedLines) {
    // 줄 안의 모든 요소들
    const children = line.children;
    for (const child of children) {
      const classname = child.getAttribute("class");
      if (!classname) return;
      const classnames = classname.match(validClass) as string[];

      child.setAttribute(
        "class",
        `${styles[classnames[0]]} ${styles[classnames[1]]} ${styles.selected}`
      );
    }
  }

  // 마지막 줄
  const firstLine = content.firstChild as HTMLElement;
  const firstChildren = [...firstLine.children] as HTMLElement[];

  const selection = getSelection();
  if (!selection) return;

  // 커서의 위치
  const { spanMovedTo, index } = moveToDifferentLine(curElem, firstLine);

  const indexOfSpan = firstChildren.indexOf(spanMovedTo);

  // 이 후 span 모두 selected 클래스로 변경
  const nextSpans = firstChildren.slice(indexOfSpan + 1);

  for (const span of nextSpans) {
    const classname = span.getAttribute("class");
    if (!classname) return;
    const classnames = classname?.match(validClass) as string[];

    span.setAttribute(
      "class",
      `${styles[classnames[0]]} ${styles[classnames[1]]} ${styles.selected}`
    );
  }

  // 위치가 일치하는 span 중 index까지 변환
  // 위치가 일치하는 요소의 text
  const elemText = spanMovedTo.textContent || "";
  const selectedText = elemText.slice(index);
  console.log("선택된 문자열", selectedText);

  const unselectedText = elemText.slice(0, index);
  console.log("선택 안 된 문자열", selectedText);
  spanMovedTo.innerText = unselectedText;

  const selectedSpan = createSelectedSpan(spanMovedTo, selectedText);
  spanMovedTo.appendChild(selectedSpan);

  selectToStart();
};

// shift + PgDn으로 문장 마지막 줄 현재 위치까지 선택하기
const selectWithPgDn = () => {
  const { curElem, curLine } = getCurElement();
  if (!curElem) return;

  // 에디터
  const content = curElem?.parentElement?.parentElement as HTMLElement;
  if (!content) return;

  // 에디터 내의 모든 줄
  const lines = [...content.children] as HTMLElement[];

  // 현재 줄의 위치
  const indexOfline = lines.indexOf(curLine);

  // 현 줄 이후의 줄 배열 - 마지막 줄
  const selectedLines = lines.slice(indexOfline + 1, lines.length - 1);

  // 선택된 줄들에 selected 클래스 추가하기
  for (const line of selectedLines) {
    // 줄 안의 모든 요소들
    const children = line.children;
    for (const child of children) {
      const classname = child.getAttribute("class");
      if (!classname) return;
      const classnames = classname.match(validClass) as string[];

      child.setAttribute(
        "class",
        `${styles[classnames[0]]} ${styles[classnames[1]]} ${styles.selected}`
      );
    }
  }

  // 마지막 줄
  const lastLine = content.lastChild as HTMLElement;
  const lastChildren = [...lastLine.children] as HTMLElement[];

  const selection = getSelection();
  if (!selection) return;

  const { spanMovedTo, index } = moveToDifferentLine(curElem, lastLine);

  const indexOfSpan = lastChildren.indexOf(spanMovedTo);

  // 이전 span 모두 selected 클래스로 변경
  const prevSpans = lastChildren.slice(0, indexOfSpan);

  for (const span of prevSpans) {
    const classname = span.getAttribute("class");
    if (!classname) return;
    const classnames = classname?.match(validClass) as string[];

    span.setAttribute(
      "class",
      `${styles[classnames[0]]} ${styles[classnames[1]]} ${styles.selected}`
    );
  }

  // 위치가 일치하는 span 중 index까지 변환
  // 위치가 일치하는 요소의 text
  const elemText = spanMovedTo.textContent || "";
  const selectedText = elemText.slice(0, index);
  const unselectedText = elemText.slice(index);
  spanMovedTo.innerText = unselectedText;

  const selectedSpan = createSelectedSpan(spanMovedTo, selectedText);
  spanMovedTo.prepend(selectedSpan);

  // 첫 줄 커서 부터 마지막 까지 선택
  selectToEnd();
};

// shift + →
const selectWithArrowRight = (
  e: React.KeyboardEvent<HTMLDivElement>,
  start: number,
  setStart: (value: number) => void,
  selectedText: string,
  setSelectedText: (value: string) => void
) => {
  e.preventDefault();

  const {
    curElem,
    curText,
    curClassNames,
    nextElem,
    nextText,
    nextClassNames,
    nextLine,
  } = getCurElement();
  if (!curElem) return;

  // 현재 위치
  let index = start;
  console.log("현재 커서 위치", index);

  // 현재 요소
  let curElement = curElem;

  // 현재 요소의 문자열
  let selectedTexts = selectedText;

  const nextFirst = nextLine?.firstChild as HTMLElement;

  // 현재 요소가 selected가 아닌 경우
  if (!curClassNames.includes("selected")) {
    // 선택안된 문자열은 현재 요소에 삽입
    const unselectedBefore = curText.slice(0, index);
    console.log("선택 전 문자열", unselectedBefore);

    const unselectedAfter = curText.slice(index + 1);
    console.log("선택 후 문자열", unselectedAfter);

    if (unselectedAfter) {
      const span = document.createElement("span");
      span.setAttribute(
        "class",
        `${styles[curClassNames[0]]} ${styles[curClassNames[1]]}`
      );
      span.setAttribute("contentEditable", "true");
      span.innerText = unselectedAfter;

      curElement.after(span);
    }

    // 선택된 문자열 현재 문자열 옆에 selected span으로 삽입
    const selected = curText.slice(index, index + 1);
    console.log("선택된 문자열", selected);

    const selectedSpan = createSelectedSpan(curElem, selected);

    curElement.after(selectedSpan);

    curElement = selectedSpan;
    selectedTexts = selected;

    index = 1;

    setStart(index);
    setSelectedText(selectedTexts);

    if (unselectedBefore) {
      curElem.innerText = unselectedBefore;
    } else {
      curElem.remove();
    }
  } else {
    // 현재 요소가 selected 인 경우
    // 다음 요소가 있는 경우
    if (nextElem) {
      // 현재 요소와 다음 요소가 같은 클래스 인 경우 병합
      // 혹은 현재 요소 다음 요소 모두 span 클래스인 경우
      if (
        (curClassNames[0] === nextClassNames[0] &&
          curClassNames[1] === nextClassNames[1]) ||
        (curClassNames[0] === "span" && nextClassNames[0] === "span")
      ) {
        // 첫 문자를 선택 문자열에 추가
        selectedTexts += nextText.slice(0, 1);

        // 선택 문자열을 현재 요소에 삽입
        curElement.innerText = selectedTexts;
        // 선택 문자열 업데이트
        setSelectedText(selectedTexts);

        // 위치를 선택 문자열의 길이로 업데이트
        index = selectedTexts.length;

        // 남은 문자열 추출
        const remainedText = nextText.slice(1);

        // 남은 문자열이 있다면
        if (remainedText) {
          // 다음 문자열에 남은 문자열 삽입
          nextElem.innerText = nextText.slice(1);
        } else {
          // 다음 문자열이 없다면 다음 요소 삭제
          nextElem.remove();
        }
      } else {
        // 현재 요소와 다음 요소의 클래스가 다른 경우
        const addedText =
          (nextClassNames[1] === "gap" ? " " : "") + nextText.slice(0, 1);

        // 다음 요소와 동일한 클래스의 selected Span 생성
        const selectedSpan = createSelectedSpan(nextElem, addedText);

        curElement.after(selectedSpan);

        setSelectedText(addedText);

        const remainedText = nextText.slice(1);

        if (nextClassNames[1] === "gap") {
          nextElem.setAttribute("class", `${styles.span} ${styles.normal}`);
        }
        if (remainedText) {
          nextElem.innerText = remainedText;
        } else {
          nextElem.remove();
        }

        curElement = selectedSpan;
        index = addedText.length;
      }
    } else {
      // 다음 요소가 없는 경우
      // 다음 줄이 있는 경우
      if (nextLine) {
        curElement = nextFirst;
        index = 0;
      }
    }
  }

  setCursorPosition(curElement, index);
};

// shift + ←
const selectWithArrowLeft = (
  e: React.KeyboardEvent<HTMLDivElement>,
  start: number,
  setStart: (value: number) => void,
  selectedText: string,
  setSelectedText: (value: string) => void
) => {
  e.preventDefault();

  const {
    curElem,
    curText,
    curClassNames,
    prevElem,
    prevText,
    prevClassNames,
    prevLine,
  } = getCurElement();
  if (!curElem) return;

  // 현재 위치
  let cursorPostion = start;
  console.log("현재 커서 위치", cursorPostion);

  // 현재 요소
  let curElement = curElem;

  // 현재 요소의 문자열
  let selectedTexts = selectedText;

  // 이전 줄 마지막 요소
  const prevLast = prevLine?.lastChild as HTMLElement;
  const prevLastText = prevLast?.textContent || "";

  // 현재 요소가 selected가 아닌 경우
  if (!curClassNames.includes("selected")) {
    // 선택안된 문자열은 현재 요소에 삽입
    const unselectedBefore = curText.slice(0, cursorPostion - 1);
    console.log("선택 전 문자열", unselectedBefore);

    const unselectedAfter = curText.slice(cursorPostion);
    console.log("선택 후 문자열", unselectedAfter);

    // 선택 후 문자열 있는 경우
    if (unselectedAfter) {
      const span = document.createElement("span");
      span.setAttribute(
        "class",
        `${styles[curClassNames[0]]} ${styles[curClassNames[1]]}`
      );
      span.setAttribute("contentEditable", "true");
      span.innerText = unselectedAfter;

      curElement.after(span);
    }

    // 선택된 문자열 현재 문자열 옆에 selected span으로 삽입
    const selected = curText.slice(cursorPostion - 1, cursorPostion);
    console.log("선택된 문자열", selected);

    // 선택된 요소 생성
    const selectedSpan = createSelectedSpan(curElem, selected);

    // 현재 요소 뒤에 선택된 요소 삽입
    curElement.after(selectedSpan);

    // 현재 요소를 선택된 요소로 변경
    curElement = selectedSpan;
    // 선택된 문자열 삽입
    selectedTexts = selected;

    // 커서 위치를 0으로 변경
    cursorPostion = 0;

    setStart(cursorPostion);
    setSelectedText(selectedTexts);

    if (unselectedBefore) {
      curElem.innerText = unselectedBefore;
    } else {
      curElem.remove();
    }
  } else {
    // 현재 요소가 selected 인 경우
    // 이전 요소가 있는 경우
    if (prevElem) {
      // 현재 요소와 다음 요소가 같은 클래스 인 경우 병합
      // 혹은 현재 요소 다음 요소 모두 span 클래스인 경우

      // 이전 문자열의 길이
      const prevTextLength = prevText.length;
      // 이전 문자열에 추출한 문자
      const exactedText = prevText.slice(prevTextLength - 1, prevTextLength);
      // 남은 문자열 추출
      const remainedText = prevText.slice(0, prevTextLength - 1);

      // 현재 요소와 이전 요소가 같은 경우
      if (
        (curClassNames[0] === prevClassNames[0] &&
          curClassNames[1] === prevClassNames[1]) ||
        (curClassNames[0] === "span" && prevClassNames[0] === "span")
      ) {
        // 마지막 문자를 선택 문자열에 추가(이전 선택 문자열 앞에 추가해야 함 주의)
        selectedTexts = exactedText + selectedTexts;

        // 선택 문자열을 현재 요소(selected)에 삽입
        curElement.innerText = selectedTexts;
        // 선택 문자열 업데이트
        setSelectedText(selectedTexts);

        // 위치는 현재 위치인 0으로

        // 남은 문자열이 있다면
        if (remainedText) {
          // 이전 문자열에 남은 문자열 삽입
          prevElem.innerText = remainedText;
        } else {
          // 이전 문자열이 없다면 이전 요소 삭제
          prevElem.remove();
        }
      } else {
        // 현재 요소와 다음 요소의 클래스가 다른 경우

        // 다음 요소와 동일한 클래스의 selected Span 생성
        const selectedSpan = createSelectedSpan(prevElem, "");

        prevElem.after(selectedSpan);

        setSelectedText("");

        curElement = selectedSpan;
      }
    } else {
      // 다음 요소가 없는 경우
      // 다음 줄이 있는 경우
      if (prevLine) {
        curElement = prevLast;
        cursorPostion = prevLastText.length;
      }
    }
  }

  setCursorPosition(curElement, cursorPostion);
};

const selectWithArrowUp = (
  e: React.KeyboardEvent<HTMLDivElement>,
  start: number,
  setStart: (value: number) => void,
  selectedText: string,
  setSelectedText: (value: string) => void
) => {};
const selectWithArrowDown = (
  e: React.KeyboardEvent<HTMLDivElement>,
  start: number,
  setStart: (value: number) => void,
  selectedText: string,
  setSelectedText: (value: string) => void
) => {};

export {
  selectToEnd,
  selectToStart,
  selectWithArrowDown,
  selectWithArrowLeft,
  selectWithArrowRight,
  selectWithArrowUp,
  selectWithPgDn,
  selectWithPgUp,
};
