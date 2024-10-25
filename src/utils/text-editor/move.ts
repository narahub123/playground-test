import {
  getCurElement,
  initializeSelection,
  setCursorPosition,
} from "./text-editor";
import { varifySelected } from "./varify";

// 커서 오른쪽 이동
const moveRight = (
  e: React.KeyboardEvent<HTMLDivElement>,
  setStart: (value: number) => void,
  setSelectedText: (value: string) => void,
  contentRef: React.RefObject<HTMLDivElement>
) => {
  e.preventDefault();
  // 현재 요소가 selected 클래스인 확인하기
  const isSelected = varifySelected();

  // 커서 이동으로 인한 초기화 이전에 저장해야할 기존 정보들
  // selected 클래스 내의 문자열 및 클래스 이름, 이전 요소들의 문자열 및 클래스 이름
  let { curText, prevText, curClassNames, prevClassNames } = getCurElement();

  // 선택 초기화
  initializeSelection(setStart, setSelectedText, contentRef);

  const { curElem, curPosition, nextElem, nextClassName, nextLine } =
    getCurElement();

  if (!curElem) return;

  // 현재 요소가 selected 클래스가 아닌 경우
  if (!isSelected) {
    curText = getCurElement().curText;
    // 아래 요소들은 selected가 아닌 클래스에서 사용하지 않는데
    // 갱신이 필요한지 모르겠음
    prevText = getCurElement().prevText;
    curClassNames = getCurElement().curClassNames;
    prevClassNames = getCurElement().prevClassNames;
  }

  // 커서가 위치할 요소
  let cursortElement = curElem;
  // 커서의 요소 내의 위치
  let cursorPosition = curPosition;

  // 현재 요소 내의 문자열의 길이
  const curTextLength = curText.length;

  // 현재 요소가 selected 클래스 일 때
  if (isSelected) {
    // 이전 요소 문자열의 길이(현재 요소가 selected인 경우에만 필요)
    const prevTextLength = prevText?.length || 0;
    // 이전 요소와 현재 요소가 같은 클래스인 경우
    if (curClassNames[0] === prevClassNames[0]) {
      // 커서 위치는 이전 클래스의 문자열 + 현재 요소의 문자열의 길이를 더한 값
      cursorPosition = prevTextLength + curTextLength;
    } else {
      // 이전 요소와 현재 요소가 다른 클래스인 경우
      // 현재 요소의 문자열의 길이를 더한 값
      cursorPosition = curTextLength;
    }
  } else {
    // 현재 요소가 selected 클래스 안이 아닌 경우
    if (curPosition < curTextLength) {
      // 커서의 위치가 현재 문자열의 길이보다 작은 경우
      // 커서 위치를 오른쪽으로 하나 이동함
      cursorPosition += 1;
    } else {
      // 커서의 위치가 현재 문자열의 길이와 같은 경우
      // 다음 요소를 가지고 있는 경우
      if (nextElem) {
        // 다음 요소를 현재 요소로 설정
        cursortElement = nextElem;
        // 다음 요소가 link 클래스 인 경우
        if (nextClassName.includes("link")) {
          // 커서가 link의 1로 이동
          cursorPosition = 1;
        } else {
          // 커서가 span의 0으로 이동
          cursorPosition = 0;
        }
      } else if (!nextElem && nextLine) {
        // 다음요소가 없고 다음 줄이 있는 경우
        const nextFirst = nextLine.firstChild as HTMLElement;

        // 다음 줄의 첫 요소를 현재 요소로 설정
        cursortElement = nextFirst;
        // 다음 줄의 첫 요소의 0으로 커서 이동
        cursorPosition = 0;
      }
    }
  }

  // 커서 위치 지정하기
  setCursorPosition(cursortElement, cursorPosition);
  // 커서의 시작 위치 지정하기
  setStart(cursorPosition);
};

// 커서 왼쪽 이동
const moveLeft = (
  e: React.KeyboardEvent<HTMLDivElement>,
  setStart: (value: number) => void,
  setSelectedText: (value: string) => void,
  contentRef: React.RefObject<HTMLDivElement>
) => {
  e.preventDefault();
  // 현재 요소가 selected 클래스인 확인하기
  const isSelected = varifySelected();

  // 커서 이동으로 인한 초기화 이전에 저장해야할 기존 정보들
  // selected 클래스 내의 문자열 및 클래스 이름, 이전 요소들의 문자열 및 클래스 이름
  let { curText, prevText, curClassNames } = getCurElement();

  // 선택 초기화
  initializeSelection(setStart, setSelectedText, contentRef);

  const { curElem, curPosition, prevElem, prevLine } = getCurElement();

  if (!curElem) return;

  // 현재 요소가 selected 클래스가 아닌 경우
  if (!isSelected) {
    curText = getCurElement().curText;
    // 아래 요소들은 selected가 아닌 클래스에서 사용하지 않는데
    // 갱신이 필요한지 모르겠음
    prevText = getCurElement().prevText;
    curClassNames = getCurElement().curClassNames;
  }

  // 커서가 위치할 요소
  let cursortElement = curElem;
  // 커서의 요소 내의 위치
  let cursorPosition = curPosition;

  // 현재 요소가 selected 클래스 일 때
  if (!isSelected) {
    // 현재 요소가 selected 클래스 안이 아닌 경우
    // 기준점
    // 현재 요소가 span인 경우 혹은 이전 요소가 없는 경우 : 0
    // 그 외 : 1
    const focalPoint = curClassNames[0] === "span" || !prevElem ? 0 : 1;
    // 커서의 위치가 기준점보다 큰 경우
    if (focalPoint < curPosition) {
      // 커서 위치를 왼쪽으로 하나 이동함
      cursorPosition -= 1;
    } else if (focalPoint === cursorPosition) {
      // 커서의 위치가 기준점과 같은 경우
      // 이전 요소를 가지고 있는 경우
      if (prevElem) {
        // 이전 요소를 현재 요소로 지정
        cursortElement = prevElem;
        // 이전의 마지막을 커서 위치로 지정
        cursorPosition = prevText.length;
      } else if (!prevElem && prevLine) {
        // 이전 요소가 없고 이전 줄이 있는 경우
        // 이전 줄의 마지막 요소
        const prevLast = prevLine.lastChild as HTMLElement;
        // 이전 줄의 마지막 요소의 문자열
        const prevLastText = prevLast?.textContent || "";

        // 이전 줄의 마지막 요소를 현재 요소로 설정
        cursortElement = prevLast;
        // 이전 줄의 마지막 요소의 길이만큼의 위치에 커서 이동
        cursorPosition = prevLastText.length;
      }
    }
  }

  // 커서 위치 지정하기
  setCursorPosition(cursortElement, cursorPosition);
  // 커서의 시작 위치 지정하기
  setStart(cursorPosition);
};

// ------------------------- 여기서부터 시작할 것 -----------------------
// ↑ 방향키 사용시
const moveup = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const { curElem, prevLine } = getCurElement();
  if (!curElem) return;

  // 이전 줄이 존재하지 않으면 아무것도 하지 않음
  if (!prevLine) return;

  // 이전 줄로 이동하기
  const { spanMovedTo, index } = moveToDifferentLine(curElem, prevLine);

  setCursorPosition(spanMovedTo, index);
};

// ↓ 방향키 사용시
const movedown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();

  const { curElem, nextLine } = getCurElement();
  if (!curElem) return;

  // 다음 줄이 존재하지 않으면 아무것도 하지 않음
  if (!nextLine) return;

  // 다음 줄로 이동하기
  const { spanMovedTo, index } = moveToDifferentLine(curElem, nextLine);

  setCursorPosition(spanMovedTo, index);
};

// Home 키
const moveStart = (e: React.KeyboardEvent<HTMLDivElement>) => {
  const { curElem, curLine } = getCurElement();
  if (!curElem) return;

  const firstChild = curLine?.firstChild as HTMLElement;

  setCursorPosition(firstChild, 0);
};

// End 키
const moveEnd = (e: React.KeyboardEvent<HTMLDivElement>) => {
  const { curElem, curLine } = getCurElement();
  if (!curElem) return;

  const lastChild = curLine?.lastChild as HTMLElement;
  const text = lastChild?.textContent || "";

  setCursorPosition(lastChild, text.length);
};

// PgUp 키
const movePageUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
  const { curElem } = getCurElement();
  if (!curElem) return;

  const content = curElem.parentElement?.parentElement;
  if (!content) return;

  const firstLine = content.firstChild as HTMLElement;

  const { spanMovedTo, index } = moveToDifferentLine(curElem, firstLine);

  setCursorPosition(spanMovedTo, index);
};

// PgDn 키
const movePageDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  const { curElem } = getCurElement();
  if (!curElem) return;

  const content = curElem?.parentElement?.parentElement;
  if (!content) return;

  const lastChild = content.lastChild as HTMLElement;

  const { spanMovedTo, index } = moveToDifferentLine(curElem, lastChild);

  setCursorPosition(spanMovedTo, index);
};

// 다른 줄로 이동하기
const moveToDifferentLine = (
  curElem: HTMLElement,
  lineMovedTo: HTMLElement
) => {
  // 커서의 위치
  const cursorPosition = getCursorPos();

  // 커서가 이동할 요소와 커서의 left 좌표
  const { spanMovedTo, xPos } = getElementInLineByPosition(
    cursorPosition,
    curElem,
    lineMovedTo
  );

  // 이동할 요소 내에서의 위치
  const index = getPosition(spanMovedTo, cursorPosition - xPos);

  return { spanMovedTo, index };
};

// 커서 위치 찾기
const getCursorPos = () => {
  const selection = window.getSelection();
  if (!selection) return 0;

  const focusNode = selection.focusNode as HTMLElement;
  const focusOffset = selection.focusOffset;

  const length = focusNode.textContent ? focusNode.textContent.length : 0;

  if (!focusNode.parentElement) return 0;

  // 문자를 감싸는 컨테이너
  const span = length === 0 ? focusNode : focusNode.parentElement;

  // 해당 컨네이터의 좌측 좌표 구하기
  let x = span.getBoundingClientRect().left;

  // 컨테이너 내에서 커서 이전의 문자열 가져오기
  const text = focusNode.textContent || "";

  const textBeforeCursor = text ? text.slice(0, focusOffset) : "";

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!canvas || !context) return 0;

  const style = window.getComputedStyle(span);

  const font = style.font;

  context.font = font;

  // 문자열의 길이 계산
  const width = context.measureText(textBeforeCursor).width;

  x += width;

  return x;
};

// 요소 내 위치 찾기
const getPosition = (elem: HTMLElement, pos: number) => {
  let index = 0;
  console.log(elem);

  // 요소 내 문자열
  const text = elem?.textContent || "";

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!canvas || !context) {
    index = 0;
    return index;
  }

  const style = window.getComputedStyle(elem);

  const font = style.font;

  context.font = font;

  for (let i = 0; i <= text.length; i++) {
    // 문자열을 순서대로
    const cut = text.slice(0, i);

    // 해당 문자열의 길이
    const width = context.measureText(cut).width;

    if (width >= pos) {
      const iB4 = i > 0 ? i - 1 : 0;
      const cutB4 = text.slice(0, iB4);

      const widthB4 = context.measureText(cutB4).width;

      if (width - pos <= pos - widthB4) {
        index = i;
      } else {
        index = i - 1;
      }

      break;
    } else {
      index = text.length;
    }
  }

  return index;
};

// 위치로 요소 찾기
const getElementInLineByPosition = (
  x: number,
  curElem: HTMLElement,
  targetLine: HTMLElement
) => {
  let spanMovedTo = undefined;
  let xPos = undefined;

  // 줄 요소 찾기
  const line = curElem.parentElement;
  // 현재 위치 고수
  const length = curElem.textContent ? curElem.textContent.length : 0;

  if (!line) {
    spanMovedTo = curElem;
    xPos = length;

    return { spanMovedTo, xPos };
  }

  const children = targetLine.children;

  // 자식 요소들의 left의 합
  xPos = 0;

  let i = 0;
  let chosen = 0;

  // 자식 요소들의 left의 좌표가 커서의 위치보다 클 때까지
  while (xPos <= x && children[i]) {
    const child = children[i];

    const left = child.getBoundingClientRect().left;

    if (left > x) {
      chosen = i - 1;
      xPos = children[i - 1].getBoundingClientRect().left;
      break;
    } else if (i === children.length - 1) {
      chosen = i;
      xPos = left;
      break;
    }

    xPos = left;
    i++;
  }

  spanMovedTo = children[chosen];

  return { spanMovedTo: spanMovedTo as HTMLElement, xPos };
};
export {
  moveRight,
  moveLeft,
  moveup,
  movedown,
  moveStart,
  moveEnd,
  movePageUp,
  movePageDown,
  moveToDifferentLine,
};
