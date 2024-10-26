import { getNextTextNode } from "./get";
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
  } else {
    // 현재 노드의 위치가 현재 노드의 문자열의 길이보다 작은 경우
    cursorPosition += 1;
  }

  setCursorPosition(cursorElement as HTMLElement, cursorPosition);
};

export { moveRight };
