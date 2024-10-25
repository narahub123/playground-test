import { getFirstSelected } from "./get";
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

  const { position } = getFirstSelected();

  // 커서 이동으로 인한 초기화 이전에 저장해야할 기존 정보들
  // selected 클래스 내의 문자열 및 클래스 이름, 이전 요소들의 문자열 및 클래스 이름
  let { prevText, curClassNames } = getCurElement();

  // 선택 초기화
  initializeSelection(setStart, setSelectedText, contentRef);

  const { curElem, curPosition, prevElem, prevLine } = getCurElement();

  if (!curElem) return;

  // 현재 요소가 selected 클래스가 아닌 경우
  if (!isSelected) {
    // 아래 요소들은 selected가 아닌 클래스에서 사용하지 않는데
    // 갱신이 필요한지 모르겠음
    prevText = getCurElement().prevText;
    curClassNames = getCurElement().curClassNames;
  }

  // 커서가 위치할 요소
  let cursortElement = curElem;
  // 커서의 요소 내의 위치
  let cursorPosition = curPosition;

  // 현재 요소가 selected 클래스가 아닐 때
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
  } else {
    // 현재 요소가 selected 클래스 일 때
    // 첫 선택 요소가 없어지는 경우의 위치를 알아야 함
    cursorPosition = position;
  }

  // 커서 위치 지정하기
  setCursorPosition(cursortElement, cursorPosition);
  // 커서의 시작 위치 지정하기
  setStart(cursorPosition);
};

// ↑ 방향키 사용시
const moveup = (
  e: React.KeyboardEvent<HTMLDivElement>,
  leftPosition: number | undefined,
  setLeftPosition: (value: number) => void
) => {
  e.preventDefault();
  const { curElem, prevLine } = getCurElement();
  if (!curElem) return;

  // 이전 줄이 존재하지 않으면 아무것도 하지 않음
  if (!prevLine) return;

  // 이전 줄로 이동하기: 이전의 같은 위치로 이동
  const { spanMovedTo, index } = moveToDifferentLine(
    curElem,
    prevLine,
    leftPosition,
    setLeftPosition
  );

  setCursorPosition(spanMovedTo, index);
};

// ↓ 방향키 사용시
const movedown = (
  e: React.KeyboardEvent<HTMLDivElement>,
  leftPosition: number | undefined,
  setLeftPosition: (value: number) => void
) => {
  e.preventDefault();

  const { curElem, nextLine } = getCurElement();
  if (!curElem) return;

  // 다음 줄이 존재하지 않으면 아무것도 하지 않음
  if (!nextLine) return;

  // 다음 줄로 이동하기 : 다음 줄의 같은 위치
  const { spanMovedTo, index } = moveToDifferentLine(
    curElem,
    nextLine,
    leftPosition,
    setLeftPosition
  );

  setCursorPosition(spanMovedTo, index);
};

// Home 키
const moveStart = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const { curElem, curLine } = getCurElement();
  if (!curElem || !curLine) return;

  // 현재 줄의 첫 번째 요소
  const firstChild = curLine.firstChild as HTMLElement;

  // 현재 줄의 첫 번째 요소의 0으로 이동
  setCursorPosition(firstChild, 0);
};

// End 키
const moveEnd = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const { curElem, curLine } = getCurElement();
  if (!curElem || !curLine) return;

  // 현재 줄의 마지막 요소
  const lastChild = curLine.lastChild as HTMLElement;
  // 현재 줄의 마지막 요소의 문자열
  const text = lastChild?.textContent || "";

  // 현재 줄 마지막 요소의 마지막 위치에 커서 지정
  setCursorPosition(lastChild, text.length);
};

// PgUp 키
const movePageUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const { curElem } = getCurElement();
  if (!curElem) return;

  // 현재 요소가 포함된 컨텐트
  const content = curElem.parentElement?.parentElement;
  if (!content) return;

  // 컨텐트의 첫 번째 줄
  const firstLine = content.firstChild as HTMLElement;

  // 이동해야 할 요소와 요소 내의 위치 찾기 : 첫 번째 줄의 요소에서 찾아야 함
  const { spanMovedTo, index } = moveToDifferentLine(curElem, firstLine);

  // 커서 지정
  setCursorPosition(spanMovedTo, index);
};

// PgDn 키
const movePageDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const { curElem } = getCurElement();
  if (!curElem) return;

  // 현재 요소가 포함된 컨텐트
  const content = curElem?.parentElement?.parentElement;
  if (!content) return;

  // 컨텐트의 마지막 줄
  const lastLine = content.lastChild as HTMLElement;

  // 커서가 이동할 요소와 요소 내의 위치 찾기 : 마지막 줄의 요소
  const { spanMovedTo, index } = moveToDifferentLine(curElem, lastLine);

  // 커서 지정
  setCursorPosition(spanMovedTo, index);
};

// ------------------------- 여기서부터 시작할 것 -----------------------

// 다른 줄로 이동하기
const moveToDifferentLine = (
  curElem: HTMLElement,
  lineMovedTo: HTMLElement,
  leftPosition?: number | undefined,
  setLeftPosition?: (value: number) => void
) => {
  // 커서의 위치 : 좌측 좌표가 존재하면 좌측 좌표를 사용하고 아니면 계산해야함
  const cursorPosition = leftPosition
    ? leftPosition
    : getCursorPos(setLeftPosition);

  // 커서가 이동할 요소와 커서의 left 좌표
  const { spanMovedTo, index } = getElementInLineByPosition(
    cursorPosition,
    curElem,
    lineMovedTo
  );

  return { spanMovedTo, index };
};

// 커서 좌표 찾기 : left
const getCursorPos = (setLeftPosition?: (value: number) => void) => {
  const { curElem, curText, curPosition } = getCurElement();

  // 해당 컨네이터의 좌측 좌표 구하기
  let leftPosition = curElem.getBoundingClientRect().left;

  // 커서 이전의 문자열
  const textBeforeCursor = curText ? curText.slice(0, curPosition) : "";

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!canvas || !context) return 0;

  // 현재 요소의 css 스타일 얻기
  const style = window.getComputedStyle(curElem);

  // 현재 요소의 폰트
  const font = style.font;

  // context의 폰트에 현재 요소의 폰트 삽입
  context.font = font;

  // 문자열의 길이 계산
  const widthOfTextBeforeCursor = context.measureText(textBeforeCursor).width;

  // 현재 요소의 좌측 좌표에 커서 이전 문자열의 길이 추가하기
  leftPosition += widthOfTextBeforeCursor;

  if (setLeftPosition) setLeftPosition(leftPosition);
  return leftPosition;
};

// left 좌표로 요소 찾기
const getElementInLineByPosition = (
  leftPosition: number, // left 좌표
  curElem: HTMLElement,
  targetLine: HTMLElement
) => {
  // 이동할 요소
  let spanMovedTo = undefined;
  let index = 0;
  // 이동할 요소의 left 좌표
  let xPos = 0;

  // 현재 줄
  const line = curElem.parentElement;

  // 현재 줄이 없는 경우
  if (!line) {
    spanMovedTo = curElem;

    return { spanMovedTo, index };
  }

  // 이동할 줄의 자식 요소
  const children = targetLine.children;

  let i = 0;

  // 이동할 자식 요소의 순서
  let chosen = 0;

  // 자식 요소들의 left의 좌표가 커서의 위치보다 클 때까지
  // 자식 요소가 있고 이전 자식 요소의 left 좌표가 leftPosition 보다 작거나 같은 경우
  while (xPos <= leftPosition && children[i]) {
    // 검사할 자식 요소
    const child = children[i];

    // 검사하는 자식 요소의 left 좌표
    const left = child.getBoundingClientRect().left;

    // 현재 자식 요소의 left 좌표가 leftPosition보다 큰 경우
    if (left > leftPosition) {
      // 이동할 자식 요소의 순서는 이전 자식 요소
      chosen = i - 1;
      // 이전 자식 요소의 left 좌표 삽입
      xPos = children[i - 1].getBoundingClientRect().left;

      // 이전 자식 요소의 left 좌표는 이미 xPos에 저장되어 있음
      break;
    } else if (left === leftPosition) {
      // 현재 자식 요소의 left 좌표와 leftPosition이 같은 경우
      // 이동할 자식 요소는 현재 자식 요소
      chosen = i;
      // 현재 자식 요소의 left 좌표 삽입
      xPos = left;
    } else if (i === children.length - 1) {
      // 현재 자식 요소가 자식 요소 배열의 마지막인 경우

      // 이동할 자식 요소는 현재 자식 요소
      chosen = i;
      // left 좌표를 현재 자식 요소의 left 좌표 삽입
      xPos = left;
      break;
    }

    // 위의 조건에 맞지 않는 경우: 다음 자식 요소로 이동
    i++;
  }

  // 이동할 요소
  spanMovedTo = children[chosen] as HTMLElement;

  index = getPosition(spanMovedTo, leftPosition - xPos);

  return { spanMovedTo, index };
};

// 요소 내 위치 찾기
const getPosition = (
  elem: HTMLElement, // 검사할 요소
  remainedLength: number // leftPosition에서 검사할 요소의 left 좌표를 길이
) => {
  let index = 0;

  // 요소 내 문자열
  const text = elem?.textContent || "";

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // 컨버스나 컨텍스트가 없는 경우
  if (!canvas || !context) {
    return index;
  }

  const style = window.getComputedStyle(elem);

  const font = style.font;

  context.font = font;

  for (let i = 0; i <= text.length; i++) {
    // 문자열을 순서대로
    const cut = text.slice(0, i);

    // 문자열의 길이
    const widthOfCut = context.measureText(cut).width;

    // 문자열의 길이가 남은 길이보다 크거나 같은 경우: 이 후 조사를 진행하지 않음
    if (widthOfCut >= remainedLength) {
      // 이전 순서
      const indexBefore = i > 0 ? i - 1 : 0;
      console.log(indexBefore);

      // 이전 순서 문자열
      const cutIndexBefore = text.slice(0, indexBefore);

      // 이전 문자열의 길이
      const widthOfCutIndexBefore = context.measureText(cutIndexBefore).width;

      // (문자열의 길이 - 남은 길이)가 (남은 길이 - 이전 문자열의 길이) 보다 작거나 같은 경우
      if (
        widthOfCut - remainedLength <=
        remainedLength - widthOfCutIndexBefore
      ) {
        // 현재 순서
        index = i;
      } else {
        // 이전 순서
        index = i - 1;
      }

      break;
    } else {
      // 문자열의 길이가 남은 길이보다 작은 경우
      // 문자열의 길이를 순서로 삽입

      index = text.length;
    }
  }

  console.log("인덱스", index);

  return index;
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
