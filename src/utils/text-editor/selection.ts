import { getCurElement, getTargetAndIndex } from "./get";

const selectRight = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();

  const {
    selection,
    startNode,
    startOffset,
    endNode,
    endOffset,
    nextNode,
    nextFirstNode,
  } = getCurElement();
  if (!startNode || !endNode) return;

  // 새로운 range 객체 생성
  const range = document.createRange();

  // range의 시작점 지정
  range.setStart(startNode, startOffset);

  let end = endNode;
  let text = end.textContent || "";
  let endPoint = endOffset;

  // 커서의 위치가 문자열보다 작은 경우
  if (endPoint < text.length) {
    console.log("커서 위치가 문자열의 길이 작은 경우");
    endPoint += 1;
  } else {
    // 커서 위치가 문자열과 같은 경우
    console.log("커서 위치가 문자열의 길이와 같은 경우");
    // 다음 요소가 있는 경우

    // 다음 요소가 존재하는 경우
    if (nextNode) {
      console.log("다음 요소가 존재하는 경우");
      end = nextNode;
      endPoint = 1;
    } else {
      // 다음 요소가 존재하지 않는 경우
      console.log("다음 요소가 존재하지 않는 경우");

      // 다음 줄이 존재하는 경우
      if (nextFirstNode) {
        console.log("다음 줄이 존재하는 경우");
        end = nextFirstNode;
        endPoint = 0;
      }
    }
  }

  range.setEnd(end, endPoint);
  selection?.removeAllRanges();
  selection?.addRange(range);
};

const selectLeft = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const { selection, startNode, startOffset, endNode, endOffset } =
    getCurElement();
  if (!startNode || !endNode) return;

  const range = document.createRange();

  let start = startNode;
  let startClassName = startNode.parentElement?.className;
  let startPoint = startOffset;

  // 시작점이 0보다 큰 경우
  if (startPoint > 0) {
    console.log("커서의 위치가 0보다 큰 경우");

    startPoint -= 1;
  } else {
    console.log("커서의 위치가 0인 경우");
    // 커서의 위치가 0과 같은 경우
    const prevNode =
      start.nodeType === Node.TEXT_NODE
        ? start.parentNode?.parentNode?.previousSibling?.childNodes[0]
            .childNodes[0]
        : start.parentNode?.previousSibling?.childNodes[0].childNodes[0];
    const prevText = prevNode?.textContent || "";
    if (prevNode) {
      // 이전 노드가 있는 경우
      console.log("이전 노드가 존재하는 경우");

      start = prevNode;
      startPoint = startClassName?.includes("gap")
        ? prevText.length
        : prevText.length - 1;
    } else {
      // 이전 노드가 존재하지 않는 경우
      console.log("이전 노드가 존재하지 않는 경우");
      const prevLastNode =
        start.nodeType === Node.TEXT_NODE
          ? start.parentNode?.parentNode?.parentNode?.previousSibling?.lastChild
              ?.childNodes[0].childNodes[0]
          : start.parentNode?.parentNode?.previousSibling?.lastChild
              ?.childNodes[0].childNodes[0];
      const prevLastText = prevLastNode?.textContent || "";
      console.log(prevLastNode);

      if (prevLastNode) {
        // 이전 줄 마지막 노드가 존재하는 경우
        console.log("이전 줄이 존재하는 경우");

        start = prevLastNode;
        startPoint = prevLastText.length;
      }
    }
  }

  range.setStart(start, startPoint);
  range.setEnd(endNode, endOffset);

  selection?.removeAllRanges();
  selection?.addRange(range);
};

const selectUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const {
    selection,
    startNode,
    startOffset,
    endNode,
    endOffset,
    curElem,
    curPosition,
    curLine,
  } = getCurElement();
  if (!startNode || !endNode || !curElem) return;

  const range = document.createRange();

  let start = startNode;
  let startPoint = startOffset;

  // 이전 줄 : 기준 포인트를 새로 바뀐 start 노드로 해야 함
  let prevLine =
    start.nodeType === Node.TEXT_NODE
      ? (start.parentNode?.parentNode?.parentNode
          ?.previousSibling as HTMLElement)
      : (start.parentNode?.parentNode?.previousSibling as HTMLElement);

  // 이전 줄의 마지막 요소가 있다면
  if (prevLine) {
    console.log("이전 줄 있음");
    // 커서를 이전 줄의 동일한 위치로 이동
    const { target, index } = getTargetAndIndex(curElem, curPosition, prevLine);

    const targetNode = target.firstChild?.firstChild;
    if (!targetNode) return;

    start = targetNode;
    startPoint = index;
  } else {
    // 이전 줄이 없다는 경우
    console.log("이전 줄 없음");
    const firstNode = curLine?.firstChild?.firstChild?.firstChild;
    if (!firstNode) return;

    start = firstNode;
    startPoint = 0;
  }

  range.setStart(start, startPoint);

  range.setEnd(endNode, endOffset);

  // 이전 줄이 있다면 이전 줄의 동일 위치로 이동

  // 이전 줄이 없다면 현재 줄의 처음으로 이동

  selection?.removeAllRanges();
  selection?.addRange(range);
};

const selectDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();

  const {
    selection,
    startNode,
    startOffset,
    endNode,
    endOffset,
    curElem,
    curPosition,
    curLine,
  } = getCurElement();

  if (!startNode || !endNode || !curElem || !curLine) return;

  const range = document.createRange();

  let end = endNode;
  let endPoint = endOffset;

  let nextLine =
    end.nodeType === Node.TEXT_NODE
      ? (end.parentNode?.parentNode?.parentNode?.nextSibling as HTMLElement)
      : (end.parentNode?.parentNode?.nextSibling as HTMLElement);

  // 다음 줄이 있는 경우
  if (nextLine) {
    console.log("다음 줄 있음");
    const { target, index } = getTargetAndIndex(curElem, curPosition, nextLine);

    const targetNode = target.firstChild?.firstChild;
    if (!targetNode) return;

    end = targetNode;
    endPoint = index;
  } else {
    console.log("다음 줄 없음");

    // 다음 줄이 없는 경우 : 현재 줄의 마지막으로 이동
    const lastNode = curLine.lastChild?.firstChild?.firstChild;
    if (!lastNode) return;
    const lastText = lastNode.textContent || "";

    end = lastNode;
    endPoint = lastText.length;
  }
  range.setStart(startNode, startOffset);
  range.setEnd(end, endPoint);

  selection?.removeAllRanges();
  selection?.addRange(range);
};

const selectStart = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const { selection, endNode, endOffset, curLine } = getCurElement();
  if (!endNode || !curLine) return;

  const range = document.createRange();

  // 현재 줄의 첫 노드
  const firstNode = curLine.firstChild?.firstChild?.firstChild;
  if (!firstNode) return;

  range.setStart(firstNode, 0);
  range.setEnd(endNode, endOffset);

  selection?.removeAllRanges();
  selection?.addRange(range);
};

const selectEnd = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const { selection, startNode, startOffset, curLine } = getCurElement();
  if (!startNode || !curLine) return;

  // 현재 줄의 마지막 노드
  const lastNode = curLine.lastChild?.firstChild?.firstChild;
  if (!lastNode) return;
  const lastText = lastNode.textContent || "";

  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(lastNode, lastText.length);

  selection?.removeAllRanges();
  selection?.addRange(range);
};

const selectPageUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();

  const { selection, endNode, endOffset, content } = getCurElement();
  if (!endNode || !content) return;

  // 현재 문단의 첫 노드
  const firstNode = content.firstChild?.firstChild?.firstChild?.firstChild;
  if (!firstNode) return;

  const range = document.createRange();
  range.setStart(firstNode, 0);
  range.setEnd(endNode, endOffset);

  selection?.removeAllRanges();
  selection?.addRange(range);
};

const selectPageDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();

  const { selection, startNode, startOffset, content } = getCurElement();
  if (!startNode || !content) return;

  // 현재 문단의 마지막 노드
  const lastNode = content.lastChild?.lastChild?.firstChild?.firstChild;
  if (!lastNode) return;
  const lastText = lastNode.textContent || "";

  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(lastNode, lastText.length);

  selection?.removeAllRanges();
  selection?.addRange(range);
};

export {
  selectRight,
  selectLeft,
  selectUp,
  selectDown,
  selectStart,
  selectEnd,
  selectPageUp,
  selectPageDown,
};
