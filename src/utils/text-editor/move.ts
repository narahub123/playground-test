import { getTargetAndIndex, getCurElement } from "./get";
import { setCursorPosition } from "./set";

const moveRight = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();

  const {
    curNode,
    curPosition,
    curText,
    nextElem,
    nextClassName,
    nextFirstElem,
  } = getCurElement();

  if (!curNode) return;

  let cursorElement = curNode;
  let cursorPosition = curPosition;

  // 현재 위치가 현재 요소 내의 문자열의 길이와 일치하는 경우
  if (curPosition === curText.length) {
    console.log("현재 요소 내의 문자열의 길이와 현재 위치가 일치함");
    // 다음 컨테이너가 있는지 확인하고 있다면 이동
    // 다음 컨테이너

    if (nextElem) {
      // 다음 컨테이너가 있는 경우
      console.log("다음 요소 있음");
      // 다음 컨테이너의 자식요소가 link 클래스인 경우 1로 이동 아니면 0으로 이동

      cursorElement = nextElem;
      cursorPosition = nextClassName.includes("link") ? 1 : 0;
    } else {
      console.log("다음 요소 없음");
      // 다음 줄이 있는지 확인하고 있다면 다음 줄의 첫 요소의 0에 커서 위치
      // 다음 줄이 있는 경우
      if (nextFirstElem) {
        console.log("다음 줄 있음");
        cursorElement = nextFirstElem;
        cursorPosition = 0;
      }
    }
  } else {
    console.log("현재 위치가 현재 요소의 문자열의 길이보다 작음");
    // 현재 위치가 현재 요소의 문자열의 길이보다 작은 경우 오른쪽으로 한 칸 이동
    cursorPosition += 1;
  }

  setCursorPosition(cursorElement, cursorPosition);
};

  const moveLeft = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const {
      curNode,
      curPosition,
      curClassName,
      curText,
      prevElem,
      prevText,
      prevLastElem,
      prevLastText,
    } = getCurElement();
    if (!curNode) return;

    let cursorElement = curNode;
    let cursorPosition = curPosition;

    // 기준점: link 클래스이고 문자열이 존재하고 이전 요소가 존재하는 경우 1 아닌 경우 0
    const focalPoint =
      curClassName?.includes("link") && curText && prevElem ? 1 : 0;

    // 현재 커서의 위치가 기준점과 일치하는 경우
    if (curPosition === focalPoint) {
      console.log("현재 커서의 위치가 기준점과 일치함");

      // 이전 컨테이너가 존재하는 경우 이전 요소의 마지막으로 이동
      if (prevElem) {
        console.log("이전 컨테이너가 있는 경우");

        cursorElement = prevElem;
        cursorPosition = prevText.length;
      } else {
        // 이전 컨테이너가 없는 경우
        console.log("이전 컨테이너가 없는 경우");
        // 이전 줄이 존재하는 경우
        if (prevLastElem) {
          console.log("이전 줄이 있는 경우");

          cursorElement = prevLastElem;
          cursorPosition = prevLastText.length;
        }
        console.log("이전 줄이 없는 경우");
      }
    } else {
      // 현재 커서의 위치가 기준점과 일치하지 않는 경우
      console.log("현재 커서의 위치가 기준점과 일치하지 않음");
      // 현재 위치에서 왼쪽으로 한 칸 이동함
      cursorPosition -= 1;
    }

    setCursorPosition(cursorElement, cursorPosition);
  };

const moveUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const { curNode, curPosition, curElem, curLine, prevLine } = getCurElement();
  if (!curNode || !curElem) return;

  let cursorElement = curNode;
  let cursorPosition = curPosition;

  // 이전 줄이 존재하는 경우
  if (prevLine) {
    console.log("이전 줄이 존재함");
    // 이전 줄의 동일한 위치의 요소와 해당 요소에서의 커서의 위치
    const { target, index } = getTargetAndIndex(
      curElem,
      cursorPosition,
      prevLine
    );

    cursorElement = target.firstChild as HTMLElement;
    cursorPosition = index;
  } else {
    // 이전 줄이 존재하지 않는 경우
    console.log("이전 줄이 존재하지 않음");
    // 현재 줄의 처음으로 이동
    const firstElem = curLine?.firstChild?.firstChild;
    if (!firstElem) return;

    cursorElement = firstElem;
    cursorPosition = 0;
  }

  setCursorPosition(cursorElement, cursorPosition);
};

const moveDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const { curNode, curPosition, curElem, curLine, nextLine } = getCurElement();
  if (!curNode || !curElem) return;

  let cursorElement = curNode;
  let cursorPosition = curPosition;

  // 다음 줄이 있는 경우
  if (nextLine) {
    console.log("다음 줄이 있음");
    const { target, index } = getTargetAndIndex(curElem, curPosition, nextLine);

    cursorElement = target.firstChild as HTMLElement;
    cursorPosition = index;
  } else {
    // 다음 줄이 없는 경우
    console.log("다음 줄이 없음");
    // 현재 줄의 마지막으로 이동
    // 현재 줄의 마지막 요소
    const lastElem = curLine?.lastChild?.firstChild as HTMLElement;
    if (!lastElem) return;

    // 마지막 요소의 문자열
    const lastText = lastElem.textContent || "";

    cursorElement = lastElem;
    cursorPosition = lastText.length;
  }

  setCursorPosition(cursorElement, cursorPosition);
};

const moveStart = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const { curLine } = getCurElement();

  // 현재 줄의 첫 번째 컨테이너
  const firstContainer = curLine?.firstChild;
  if (!firstContainer) return;
  // 현재 줄의 첫 번째 요소
  const firstElem = firstContainer?.firstChild;
  if (!firstElem) return;

  setCursorPosition(firstElem, 0);
};

const moveEnd = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const { curLine } = getCurElement();

  //현재 줄의 마지막 컨테이너
  const lastContainer = curLine?.lastChild;
  if (!lastContainer) return;

  // 현재 줄의 마지막 요소
  const lastElem = lastContainer.firstChild as HTMLElement;
  if (!lastElem) return;
  const lastText = lastElem.textContent || "";

  setCursorPosition(lastElem, lastText.length);
};

const movePageUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const { content } = getCurElement();
  if (!content) return;

  const firstLine = content.firstElementChild;
  const firstContainer = firstLine?.firstElementChild;
  const firstElem = firstContainer?.firstElementChild as HTMLElement;

  setCursorPosition(firstElem, 0);
};

const movePageDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const { content } = getCurElement();
  if (!content) return;

  const lastLine = content.lastChild;
  const lastContainer = lastLine?.lastChild;
  const lastElem = lastContainer?.firstChild as HTMLElement;
  const lastText = lastElem.textContent || "";

  setCursorPosition(lastElem, lastText.length);
};
export {
  moveRight,
  moveLeft,
  moveUp,
  moveDown,
  moveStart,
  moveEnd,
  movePageUp,
  movePageDown,
};
