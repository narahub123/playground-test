import { findFirstSelected } from "./find";
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

export { moveRight, moveLeft };
