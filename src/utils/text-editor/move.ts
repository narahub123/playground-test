import { getNextTextNode, getNodeAndIndex, getPrevTextNode } from "./get";
import { setCursorPosition } from "./set";

const moveRight = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();

  // selection 객체
  const selection = window.getSelection();
  if (!selection) return;

  // 현재 커서가 위치하는 노드(텍스트 노드)
  const currentNode = selection.focusNode;
  if (!currentNode) return;

  let cursorElement = currentNode;
  let cursorPosition = selection.focusOffset;

  // 현재 노드가 텍스트 노드이고 현재 커서의 위치가 현재 노드의 문자열 길이와 같은 경우
  if (
    currentNode.nodeType === Node.TEXT_NODE &&
    selection.focusOffset === currentNode.textContent?.length
  ) {
    const { next, start } = getNextTextNode(currentNode);

    // 커서가 위치할 요소 : 다음 노드가 있는 경우에는 다음 노드 없는 경우 지금 노드
    cursorElement = next || currentNode;
    cursorPosition = start;
    // 현재 노드가 요소 노드 이고 현재 커서의 위치가 현재 노드의 문자열 길이과 같은 경우
  } else if (
    currentNode.nodeType === Node.ELEMENT_NODE &&
    selection.focusOffset === currentNode.textContent?.length
  ) {
    const { next, start } = getNextTextNode(currentNode);

    // 커서가 위치할 요소 : 다음 노드가 있는 경우에는 다음 노드 없는 경우 지금 노드
    cursorElement = next || currentNode;
    cursorPosition = start;
  } else {
    // 현재 노드의 위치가 현재 노드의 문자열의 길이보다 작은 경우
    cursorPosition += 1;
  }

  setCursorPosition(cursorElement as HTMLElement, cursorPosition);
};

const moveLeft = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();

  const selection = window.getSelection();
  if (!selection) return;

  const currentNode = selection.focusNode;
  if (!currentNode) return;
  const currentPosition = selection.focusOffset;

  let cursorElement = currentNode;
  let cursorPosition = currentPosition;

  // 기준점 : link 클래스인 경우 1 아닌 경우 0
  const focalPoint = currentNode.parentElement?.className.includes("link")
    ? 1
    : 0;

  console.log(currentNode.nodeType);

  console.log(currentPosition, focalPoint);

  // 현재 노드가 텍스트 노드이고 현재 커서 위치가 기준점인 경우
  if (
    currentNode?.nodeType === Node.TEXT_NODE &&
    currentPosition === focalPoint
  ) {
    const { prev, end } = getPrevTextNode(currentNode);

    cursorElement = prev;
    cursorPosition = end;
  } else if (
    currentNode?.nodeType === Node.ELEMENT_NODE &&
    currentPosition === focalPoint
  ) {
    const { prev, end } = getPrevTextNode(currentNode);

    cursorElement = prev;
    cursorPosition = end;
  } else {
    cursorPosition -= 1;
  }

  console.log(cursorElement, cursorPosition);

  setCursorPosition(cursorElement, cursorPosition);
};

const moveUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();

  const selection = window.getSelection();
  if (!selection) return;

  const currentNode = selection.focusNode;
  if (!currentNode) return;
  const currentPosition = selection.focusOffset;

  const currentContainer = currentNode.parentNode?.parentNode;

  const currentLine = currentContainer?.parentNode;
  if (!currentLine) return;
  const prevLine = currentLine?.previousSibling;

  let cursorElement = currentNode;
  let cursorPosition = currentPosition;

  // 만약 이전 줄이 없다면 해당 줄의 처음으로 이동
  if (!prevLine) {
    const firstContainer = currentLine.firstChild;
    if (!firstContainer) return;

    cursorElement = firstContainer;
    cursorPosition = 0;
  } else if (prevLine) {
    // 이전 줄이 있다면 동일 위치로 이동
    const { node, index } = getNodeAndIndex(selection, prevLine);

    console.log(node, index);

    cursorElement = node;
    cursorPosition = index;
  }

  setCursorPosition(cursorElement, cursorPosition);
};

const moveDown = (e: React.KeyboardEvent<HTMLDivElement>) => {};

export { moveRight, moveLeft, moveUp, moveDown };
