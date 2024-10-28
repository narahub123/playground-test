import { getTargetAndIndex } from "./get";
import { setCursorPosition } from "./set";

const moveRight = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();

  const selection = getSelection();
  if (!selection) return;
  // 현재 요소
  const currentNode = selection.focusNode;
  if (!currentNode) return;
  // 현재 요소 내 커서 위치
  const currentPosition = selection.focusOffset;
  console.log("현재 요소", currentNode);
  console.log("현재 요소", currentPosition);

  // 현재 요소 내의 문자열
  const currentText = currentNode?.textContent || "";
  console.log("현재 요소 내의 문자열", currentText);

  let cursorElement = currentNode;
  let cursorPosition = currentPosition;

  // 현재 container: 현재 요소 내에 문자열이 있는 경우와 없는 경우를 구분해야 함
  const curContainer = currentText
    ? currentNode?.parentElement?.parentElement
    : currentNode?.parentElement;
  console.log("현재 컨테이너", curContainer);
  const curLine = curContainer?.parentElement;
  if (!curLine) return;

  // 현재 위치가 현재 요소 내의 문자열의 길이와 일치하는 경우
  if (currentPosition === currentText.length) {
    console.log("현재 요소 내의 문자열의 길이와 현재 위치가 일치함");
    // 다음 컨테이너가 있는지 확인하고 있다면 이동
    // 다음 컨테이너
    const nextContainer = curContainer?.nextElementSibling;

    if (nextContainer) {
      // 다음 컨테이너가 있는 경우
      console.log("다음 요소 있음");
      // 다음 컨테이너의 자식요소가 link 클래스인 경우 1로 이동 아니면 0으로 이동
      cursorElement = nextContainer.firstChild as HTMLElement;
      cursorPosition = (
        nextContainer.firstChild as HTMLElement
      ).className.includes("link")
        ? 1
        : 0;
    } else {
      console.log("다음 요소 없음");
      // 다음 줄이 있는지 확인하고 있다면 다음 줄의 첫 요소의 0에 커서 위치
      // 다음 줄
      const nextLine = curLine.nextElementSibling;
      if (nextLine) {
        console.log("다음 줄 있음");
        const firstContainer = nextLine.firstChild;

        cursorElement = firstContainer?.firstChild as HTMLElement;
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
  const selection = window.getSelection();
  if (!selection) return;
  // 현재 노드
  const currentNode = selection.focusNode as HTMLElement;
  if (!currentNode) return;
  // 현재 요소 내의 위치
  const currentPosition = selection.focusOffset;

  // 현재 노드 내 문자열
  const curText = currentNode.textContent || "";

  // 현재 요소: 현재 노드 내 문자열이 있는 경우와 없는 경우 현재 요소의 위치가 달라짐
  const curElem = curText ? currentNode.parentElement : currentNode;

  // 현재 컨테이너
  const curContainer = curElem?.parentElement;
  if (!curContainer) return;

  // 현재 줄
  const curLine = curContainer.parentElement;
  if (!curLine) return;

  let cursorElement = currentNode;
  let cursorPosition = currentPosition;

  // 기준점: link 클래스이고 문자열이 존재하는 경우 1 아닌 경우 0
  const focalPoint = curElem?.className.includes("link") && curText ? 1 : 0;

  // 현재 커서의 위치가 기준점과 일치하는 경우
  if (currentPosition === focalPoint) {
    console.log("현재 커서의 위치가 기준점과 일치함");
    const prevContainer = curContainer.previousElementSibling;

    // 이전 컨테이너가 존재하는 경우 이전 요소의 마지막으로 이동
    if (prevContainer) {
      console.log("이전 컨테이너가 있는 경우");
      const prevElem = prevContainer.children[0] as HTMLElement;
      const prevText = prevElem?.textContent || "";

      cursorElement = prevElem;
      cursorPosition = prevText.length;
    } else {
      // 이전 컨테이너가 없는 경우
      console.log("이전 컨테이너가 없는 경우");
      const prevLine = curLine.previousElementSibling;

      // 이전 줄이 존재하는 경우
      if (prevLine) {
        const lastElem = prevLine.lastChild?.firstChild as HTMLElement;

        const lastText = lastElem?.textContent || "";

        cursorElement = lastElem;
        cursorPosition = lastText.length;
      }
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
  const selection = window.getSelection();
  if (!selection) return;
  const curNode = selection.focusNode;
  if (!curNode) return;
  const curPosition = selection.focusOffset;

  const curText = curNode.textContent || "";

  const curElem = curText ? curNode.parentElement : (curNode as HTMLElement);
  if (!curElem) return;
  const curContainer = curElem?.parentElement;
  if (!curContainer) return;
  const curLine = curContainer?.parentElement;
  if (!curLine) return;

  let cursorElement = curNode;
  let cursorPosition = curPosition;

  const prevLine = curLine.previousElementSibling as HTMLElement;
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
    const firstElem = curLine.firstChild?.firstChild;
    if (!firstElem) return;

    cursorElement = firstElem;
    cursorPosition = 0;
  }

  setCursorPosition(cursorElement, cursorPosition);
};

const moveDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const selection = window.getSelection();
  if (!selection) return;
  const curNode = selection.focusNode;
  if (!curNode) return;
  const curPosition = selection.focusOffset;

  const curText = curNode.textContent || "";

  const curElem = curText ? curNode.parentElement : (curNode as HTMLElement);
  if (!curElem) return;
  const curContainer = curElem?.parentElement;
  if (!curContainer) return;
  const curLine = curContainer?.parentElement;
  if (!curLine) return;

  let cursorElement = curNode;
  let cursorPosition = curPosition;

  const nextLine = curLine.nextElementSibling as HTMLElement;

  // 다음 줄이 있는 경우
  if (nextLine) {
    console.log("다음 줄이 있음");
    const { target, index } = getTargetAndIndex(curElem, curPosition, nextLine);

    console.log("이동할 요소 및 위치", target, index);

    cursorElement = target.firstChild as HTMLElement;
    cursorPosition = index;
  } else {
    // 다음 줄이 없는 경우
    console.log("다음 줄이 없음");
    // 현재 줄의 마지막으로 이동
    // 현재 줄의 마지막 요소
    const lastElem = curLine.lastChild?.firstChild as HTMLElement;
    if (!lastElem) return;

    // 마지막 요소의 문자열
    const lastText = lastElem.textContent || "";

    cursorElement = lastElem;
    cursorPosition = lastText.length;
  }

  setCursorPosition(cursorElement, cursorPosition);
};
export { moveRight, moveLeft, moveUp, moveDown };
