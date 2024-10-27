// 다음 요소를 찾는 헬퍼 함수
const getNextTextNode = (currentNode: Node) => {
  // 현재 노드를 감싸는 container span
  const container =
    currentNode.nodeType === Node.TEXT_NODE
      ? currentNode.parentNode?.parentNode
      : currentNode.parentNode;
  console.log(container);

  // 현재 노드 내의 문자열
  const text = currentNode?.textContent || "";
  if (!container) return { next: null, start: text.length };

  // 다음 container span
  let nextContainer = container.nextSibling;
  console.log(nextContainer);

  // 다음 줄
  let nextLine = container.parentNode?.nextSibling;

  // 다음 container가 있는 경우
  if (nextContainer) {
    const startPoint = (
      nextContainer.firstChild as HTMLElement
    )?.className.includes("link")
      ? 1
      : 0;
    return { next: nextContainer?.childNodes[0], start: startPoint };
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

// 이전 요소를 찾는 헬퍼 함수
const getPrevTextNode = (currentNode: Node) => {
  const container =
    currentNode.nodeType === Node.TEXT_NODE
      ? currentNode.parentNode?.parentNode
      : currentNode.parentNode;

  if (!container)
    return {
      prev: currentNode,
      end: 0,
    };

  let prev: Node = currentNode;
  let end = 0;

  const prevContainer = container.previousSibling;
  const prevLine = container.parentElement?.previousSibling;

  // 이전 container가 있는 경우
  if (prevContainer) {
    const textNode = prevContainer.firstChild?.firstChild
      ? prevContainer.firstChild?.firstChild
      : prevContainer.firstChild;
    console.log(textNode);

    if (!textNode) return { prev: currentNode, end: 0 };
    const text = textNode?.textContent || "";
    return {
      prev: textNode,
      end: text.length,
    };
  }

  // 이전 container가 없고 이전 줄이 있는 경우
  if (prevLine) {
    const prevLastTextNode = prevLine.lastChild?.firstChild?.firstChild;
    if (!prevLastTextNode) return { prev: currentNode, end: 0 };
    const prevLastText = prevLastTextNode?.textContent || "";

    return {
      prev: prevLastTextNode,
      end: prevLastText.length,
    };
  }

  return { prev, end };
};

const getNodeAndIndex = (selection: Selection, line: HTMLElement | Node) => {
  const currentNode = selection.focusNode;
  const currentPosition = selection.focusOffset;

  const curElem = currentNode?.parentElement;

  const leftPosition = getLeftPosition(currentNode, currentPosition);

  let node;
  let index;
  const { nodeMovedTo, positionMovedTo } = getNodeAndPositionInLine(
    line,
    leftPosition
  );

  console.log(positionMovedTo);

  if (!nodeMovedTo || !positionMovedTo || !curElem) {
    return { node: currentNode as Node, index: currentPosition };
  }

  const text = nodeMovedTo?.textContent || "";

  node = nodeMovedTo;
  index = text.length;

  console.log(node, index);

  for (let i = 0; i < text.length; i++) {
    const cut = text.slice(0, i);

    const width = getTextWidth(curElem, cut);

    if (positionMovedTo < width) {
      index = i;
      break;
    }
  }

  return { node, index };
};

// 주어진 줄에서의 요소와 위치를 찾는 헬퍼 함수
const getNodeAndPositionInLine = (
  line: HTMLElement | Node,
  leftPosition: number
) => {
  let nodeMovedTo;
  let positionMovedTo;

  const children = (line as HTMLElement).children;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    console.log(child);

    const leftOfChild =
      child.firstElementChild?.getBoundingClientRect().left || 8;

    if (leftPosition <= leftOfChild - 8) {
      console.log(children[i - 1].firstChild);

      nodeMovedTo = children[i - 1].firstChild;
      positionMovedTo =
        leftPosition -
        ((children[i - 1]?.firstChild as HTMLElement)?.getBoundingClientRect()
          .left -
          8);
      return {
        nodeMovedTo,
        positionMovedTo,
      };
    }
  }

  return {
    nodeMovedTo: line.lastChild,
    positionMovedTo: line.lastChild?.textContent?.length,
  };
};

// left 좌표 알아내기
const getLeftPosition = (currentNode: Node | null, currentPosition: number) => {
  let leftPosition = 0;

  //
  const currentElem =
    currentNode?.nodeType === Node.TEXT_NODE
      ? currentNode?.parentElement
      : (currentNode as HTMLElement);

  if (!currentElem) return leftPosition;

  const text = currentElem?.textContent?.slice(0, currentPosition);
  if (!text) return leftPosition;

  const left = currentElem.getBoundingClientRect().left;

  const widthOfText = getTextWidth(currentElem, text);

  leftPosition = left + widthOfText;

  return leftPosition;
};

// 문자열의 너비 알아내기
const getTextWidth = (currentElem: HTMLElement, text: string) => {
  let width = 0;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return width;

  const style = window.getComputedStyle(currentElem);

  context.font = style.font;

  width = context.measureText(text).width;

  return width;
};

export { getNextTextNode, getPrevTextNode, getNodeAndIndex };
