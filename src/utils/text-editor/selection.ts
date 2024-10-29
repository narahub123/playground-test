import { getCurElement, getTargetAndIndex } from "./get";

const selectRight = (
  e: React.KeyboardEvent<HTMLDivElement>,
  direction: string,
  setDirection: React.Dispatch<React.SetStateAction<string>>
) => {
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

  // 방향에 대한 정의가 없거나 현재 시작점과 종료점이 같은 경우 : 방향을 right으로 설정
  if (!direction || selection?.isCollapsed) {
    setDirection("right");
  }

  const range = document.createRange();

  // 왼쪽 방향으로 선택할 때
  let start = startNode;
  let startPoint = startOffset;
  // 오른쪽 방향으로 선택할 때
  let end = endNode;
  let text = end.textContent || "";
  let endPoint = endOffset;

  if (!direction || direction === "right") {
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
  } else if (direction === "left") {
    // 진행 방향이 왼쪽인 경우
    //시작 노드와 종료 노드가 같은 노드인 경우
    // 시작 위치가 종료 위치보다 작은 경우
    if (start === end && startPoint < endPoint) {
      startPoint += 1;
    } else if (start !== end && startPoint < (start.textContent?.length || 0)) {
      // 시작 노드와 종료 노드가 다른 노드인 경우
      // 시작 위치가 시작 노드 문자열의 길이보다 작은 경우
      startPoint += 1;
    } else if (
      start !== end &&
      startPoint === (start.textContent?.length || 0)
    ) {
      // 시작 노드와 종료 노드가 다른 노드인 경우
      // 시작 위치가 시작 노드 문자열의 길이와 같은 경우
      const nextNode =
        start.nodeType === Node.TEXT_NODE
          ? start.parentNode?.parentNode?.nextSibling?.firstChild?.firstChild
          : start?.parentNode?.nextSibling?.firstChild?.firstChild;
      if (nextNode) {
        // 다음 노드가 있는 경우
        start = nextNode;
        startPoint = 1;
      } else {
        // 다음 노드가 없는 경우
        const nextFirstNode =
          start.nodeType === Node.TEXT_NODE
            ? start.parentNode?.parentNode?.parentNode?.nextSibling?.firstChild
                ?.firstChild?.firstChild
            : start.parentNode?.parentNode?.nextSibling?.firstChild?.firstChild
                ?.firstChild;
        // 다음 줄 노드가 있는 경우
        if (nextFirstNode) {
          start = nextFirstNode;
          startPoint = 0;
        }
      }
    }
  }

  range.setStart(start, startPoint);
  range.setEnd(end, endPoint);

  selection?.removeAllRanges();
  selection?.addRange(range);

  // 자연스러운 방향 전환을 위한 설정
  if (start === end && startPoint === endPoint) {
    setDirection("right");
  }
};

const selectLeft = (
  e: React.KeyboardEvent<HTMLDivElement>,
  direction: string,
  setDirection: React.Dispatch<React.SetStateAction<string>>
) => {
  e.preventDefault();

  const { selection, startNode, startOffset, endNode, endOffset } =
    getCurElement();
  if (!startNode || !endNode) return;

  // 방향이 설정되어 있지 않거나 시작점과 종료점이 일치하는 경우 : 방향을 왼쪽으로 설정
  if (!direction || selection?.isCollapsed) {
    setDirection("left");
  }

  const range = document.createRange();

  // 왼쪽 방향으로 진행할 때
  let start = startNode;
  let startClassName = start.parentElement?.className;
  let startPoint = startOffset;
  // 오른쪽 방향으로 진행할 때
  let end = endNode;
  let endPoint = endOffset;

  if (!direction || direction === "left") {
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
            ? start.parentNode?.parentNode?.parentNode?.previousSibling
                ?.lastChild?.childNodes[0].childNodes[0]
            : start.parentNode?.parentNode?.previousSibling?.lastChild
                ?.childNodes[0].childNodes[0];
        const prevLastText = prevLastNode?.textContent || "";

        if (prevLastNode) {
          // 이전 줄 마지막 노드가 존재하는 경우
          console.log("이전 줄이 존재하는 경우");

          start = prevLastNode;
          startPoint = prevLastText.length;
        }
      }
    }
  } else if (direction === "right") {
    // 시작 노드와 종료 노드가 같은 노드이고 시작 위치보다 종료 위치가 큰 경우
    if (start === end && startPoint < endPoint) {
      endPoint -= 1;
    } else if (start !== end && endPoint > 0) {
      // 시작 노드와 종료 노드가 다르고 endPoint가 0이 아닌 경우
      endPoint -= 1;
    } else if (start !== end && endPoint === 0) {
      // 시작 노드와 종료 노드가 다르고 endPoint가 0인 경우

      const prevNode =
        end.nodeType === Node.TEXT_NODE
          ? end.parentNode?.parentNode?.previousSibling?.firstChild?.firstChild
          : end.parentNode?.previousSibling?.firstChild?.firstChild;
      // 이전 노드가 존재하는 경우
      if (prevNode) {
        const prevText = prevNode.textContent || "";

        end = prevNode;
        endPoint = prevText.length - 1;
      } else {
        // 이전 노드가 존재하지 않는 경우
        const prevLastNode =
          end.nodeType === Node.TEXT_NODE
            ? end.parentNode?.parentNode?.parentNode?.previousSibling?.lastChild
                ?.firstChild?.firstChild
            : end.parentNode?.parentNode?.previousSibling?.lastChild?.firstChild
                ?.firstChild;

        // 이전 마지막 노드가 존재하는 경우
        if (prevLastNode) {
          const prevLastText = prevLastNode.textContent || "";

          end = prevLastNode;
          endPoint = prevLastText.length;
        }
      }
    }
  }

  range.setStart(start, startPoint);
  range.setEnd(end, endPoint);

  selection?.removeAllRanges();
  selection?.addRange(range);

  // 자연스러운 방향 전환을 위한 설정
  if (start === end && startPoint === endPoint) {
    setDirection("left");
  }
};

const selectUp = (
  e: React.KeyboardEvent<HTMLDivElement>,
  setDirection: React.Dispatch<React.SetStateAction<string>>
) => {
  e.preventDefault();
  const { selection, startNode, startOffset, endNode, endOffset, curElem } =
    getCurElement();
  if (!startNode || !endNode || !curElem) return;

  const range = document.createRange();

  let start = startNode;
  let startPoint = startOffset;

  // 현재 줄
  const curLine =
    start.nodeType === Node.TEXT_NODE
      ? (start.parentNode?.parentNode?.parentNode as HTMLElement)
      : (start.parentNode?.parentNode as HTMLElement);

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
    const { target, index } = getTargetAndIndex(curElem, endOffset, prevLine);

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
  setDirection("left");
};

const selectDown = (
  e: React.KeyboardEvent<HTMLDivElement>,
  setDirection: React.Dispatch<React.SetStateAction<string>>
) => {
  e.preventDefault();

  const { selection, startNode, startOffset, endNode, endOffset, curElem } =
    getCurElement();

  if (!startNode || !endNode || !curElem) return;

  const range = document.createRange();

  let end = endNode;
  let endPoint = endOffset;

  // 현재 줄
  const curLine =
    end.nodeType === Node.TEXT_NODE
      ? (end.parentNode?.parentNode?.parentNode as HTMLElement)
      : (end.parentNode?.parentNode as HTMLElement);

  let nextLine =
    end.nodeType === Node.TEXT_NODE
      ? (end.parentNode?.parentNode?.parentNode?.nextSibling as HTMLElement)
      : (end.parentNode?.parentNode?.nextSibling as HTMLElement);

  // 다음 줄이 있는 경우
  if (nextLine) {
    console.log("다음 줄 있음");
    const { target, index } = getTargetAndIndex(curElem, endOffset, nextLine);

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
  setDirection("right");
};

const selectStart = (
  e: React.KeyboardEvent<HTMLDivElement>,
  direction: string,
  setDirection: React.Dispatch<React.SetStateAction<string>>
) => {
  e.preventDefault();
  const { selection, startNode, startOffset, endNode, endOffset } =
    getCurElement();
  if (!startNode || !endNode) return;

  const range = document.createRange();

  let start = startNode;
  let startPoint = startOffset;
  let end = endNode;
  let endPoint = endOffset;

  const focalNode =
    selection?.isCollapsed || direction === "left" ? start : end;

  const curLine =
    focalNode.nodeType === Node.TEXT_NODE
      ? focalNode.parentNode?.parentNode?.parentNode
      : focalNode.parentNode?.parentNode;

  // 현재 줄의 첫 노드
  const firstNode = curLine?.firstChild?.firstChild?.firstChild;
  if (!firstNode) return;

  // 시작 노드가 위치한 줄
  const startLine =
    start.nodeType === Node.TEXT_NODE
      ? start.parentNode?.parentNode?.parentNode
      : start.parentNode?.parentNode;

  // 종료 노드가 위치한 줄
  const endLine =
    end.nodeType === Node.TEXT_NODE
      ? end.parentNode?.parentNode?.parentNode
      : end.parentNode?.parentNode;

  // 시작 노드와 종료 노드가 같은 줄인 경우
  if (startLine === endLine) {
    // 시작점과 종료점이 같은 경우
    // 방향성이 오른쪽인 경우
    if (selection?.isCollapsed || direction === "right") {
      start = firstNode;
      startPoint = 0;
      end = startNode;
      endPoint = startOffset;
    } else if (direction === "left") {
      // 시작점과 종료점이 아니라고 방향성이 왼쪽인 경우
      start = firstNode;
      startPoint = 0;
    } else if (direction === "right") {
      start = firstNode;
      startPoint = 0;
      end = startNode;
      endPoint = startOffset;
    }
    setDirection("left");
  } else if (startLine !== endLine) {
    // 시작 노드와 종료 노드가 같은 줄이 아닌 경우
    if (direction === "left") {
      // 방향성이 왼쪽인 경우
      start = firstNode;
      startPoint = 0;
      setDirection("left");
    } else if (direction === "right") {
      // 방향성이 오른쪽인 경우
      end = firstNode;
      endPoint = 0;
      setDirection("right");
    }
  }

  range.setStart(start, startPoint);
  range.setEnd(end, endPoint);

  selection?.removeAllRanges();
  selection?.addRange(range);
};

const selectEnd = (
  e: React.KeyboardEvent<HTMLDivElement>,
  direction: string,
  setDirection: React.Dispatch<React.SetStateAction<string>>
) => {
  e.preventDefault();
  const { selection, startNode, startOffset, endNode, endOffset } =
    getCurElement();
  if (!startNode || !endNode) return;

  let start = startNode;
  let startPoint = startOffset;
  let end = endNode;
  let endPoint = endOffset;

  // 기준 노드
  const focalNode =
    selection?.isCollapsed || direction === "right" ? end : start;

  // 현재 줄 : 방향성이 왼쪽인 경우에는 처음 줄 그 외에는 종료 줄
  const curLine =
    focalNode?.nodeType === Node.TEXT_NODE
      ? focalNode.parentNode?.parentNode?.parentNode
      : focalNode.parentNode?.parentNode;
  if (!curLine) return;

  // 현재 줄의 마지막 노드
  const lastNode = curLine.lastChild?.firstChild?.firstChild;
  if (!lastNode) return;
  const lastText = lastNode.textContent || "";

  const startLine =
    start?.nodeType === Node.TEXT_NODE
      ? start.parentNode?.parentNode?.parentNode
      : start.parentNode?.parentNode;

  const endLine =
    end?.nodeType === Node.TEXT_NODE
      ? end.parentNode?.parentNode?.parentNode
      : end.parentNode?.parentNode;

  if (!startLine || !endLine) return;

  const range = document.createRange();

  // 시작줄과 종료줄이 같은 경우
  if (startLine === endLine) {
    console.log("시작 줄과 종료 줄이 같은 경우");
    if (selection?.isCollapsed || direction === "right") {
      if (selection?.isCollapsed)
        console.log("시작 노드과 종료 노드가 같은 경우");
      if (direction === "right")
        console.log("시작 노드과 종료 노드가 다르고 방향성이 오른쪽 경우");
      // 시작점은 그대로 두고 종료점만 해당 줄의 마지막으로 이동
      end = lastNode;
      endPoint = lastText.length;
    } else if (direction === "left") {
      console.log("시작 노드과 종료 노드가 다르고 방향성이 왼쪽 경우");
      start = endNode;
      startPoint = endOffset;
      end = lastNode;
      endPoint = lastText.length;
    }
    setDirection("right");
  } else {
    console.log("시작 줄과 종료 줄이 같은 경우");
    if (direction === "left") {
      console.log("시작 줄과 종료 줄이 같고 방향성이 왼쪽인 경우");
      start = lastNode;
      startPoint = lastText.length;
      setDirection("left");
    } else if (direction === "right") {
      console.log("시작 줄과 종료 줄이 같고 방향성이 오른쪽인 경우");
      end = lastNode;
      endPoint = lastText.length;
      setDirection("right");
    }
  }

  range.setStart(start, startPoint);
  range.setEnd(end, endPoint);

  selection?.removeAllRanges();
  selection?.addRange(range);
};

const selectPageUp = (
  e: React.KeyboardEvent<HTMLDivElement>,
  setDirection: React.Dispatch<React.SetStateAction<string>>
) => {
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
  setDirection("right");
};

const selectPageDown = (
  e: React.KeyboardEvent<HTMLDivElement>,
  setDirection: React.Dispatch<React.SetStateAction<string>>
) => {
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
  setDirection("right");
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
