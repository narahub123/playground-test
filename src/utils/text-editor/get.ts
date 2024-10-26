// 다음 요소를 찾는 헬퍼 함수
const getNextTextNode = (currentNode: Node) => {
  // 현재 노드를 감싸는 container span
  const container = currentNode.parentNode?.parentElement;
  // 현재 노드 내의 문자열
  const text = currentNode?.textContent || "";
  if (!container) return { next: null, start: text.length };

  // 다음 container span
  let nextContainer = container.nextSibling;

  // 다음 줄
  let nextLine = container.parentNode?.nextSibling;

  // 다음 container가 있는 경우
  if (nextContainer) {
    return { next: nextContainer?.childNodes[0], start: 1 };
  }

  // 다음 container가 없고 다음 줄이 있는 경우
  if (nextLine) {
    // 다음 줄의 첫 번째 container
    const firstContainer = nextLine.firstChild;

    // 첫 번째 container가 없는 경우
    if (!firstContainer) return { next: container, start: text.length };

    return { next: firstContainer?.childNodes[0], start: 0 };
  }

  // 다음 container 나 다음 줄이 없는 경우
  return { next: container, start: text.length };
};

export { getNextTextNode };
