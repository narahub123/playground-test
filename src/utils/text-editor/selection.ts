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
    selection?.isCollapsed || direction === "right" ? end : start;

  // 현재 요소
  const curElem =
    focalNode.nodeType === Node.TEXT_NODE
      ? (focalNode.parentNode as HTMLElement)
      : (focalNode as HTMLElement);
  // 현재 줄
  const curLine =
    focalNode.nodeType === Node.TEXT_NODE
      ? (focalNode.parentNode?.parentNode?.parentNode as HTMLElement)
      : (focalNode.parentNode?.parentNode as HTMLElement);

  // 이전 줄 : 기준 포인트를 새로 바뀐 start 노드로 해야 함
  let prevLine =
    focalNode.nodeType === Node.TEXT_NODE
      ? (focalNode.parentNode?.parentNode?.parentNode
          ?.previousSibling as HTMLElement)
      : (focalNode.parentNode?.parentNode?.previousSibling as HTMLElement);

  const startLine =
    start.nodeType === Node.TEXT_NODE
      ? (start.parentNode?.parentNode?.parentNode as HTMLElement)
      : (start.parentNode?.parentNode as HTMLElement);
  const endLine =
    end.nodeType === Node.TEXT_NODE
      ? (end.parentNode?.parentNode?.parentNode as HTMLElement)
      : (end.parentNode?.parentNode as HTMLElement);

  if (!prevLine) {
    // 이전 줄이 없는 경우
    console.log("이전 줄이 없음");
    const firstNode = curLine?.firstChild?.firstChild?.firstChild;
    if (!firstNode) return;

    start = firstNode;
    startPoint = 0;
    setDirection("left");
  } else {
    // 이전 줄이 있는 경우
    console.log("이전 줄이 있음");
    if (startLine === endLine) {
      // 시작 줄과 종료 줄이 같은 경우
      console.log("시작 줄과 종료 줄이 같음");
      if (selection?.isCollapsed || direction === "left") {
        if (selection?.isCollapsed) console.log("시작 위치과 종료 위치가 같음");
        if (direction === "left") console.log("방향성이 왼쪽인 경우");
        const { target, index } = getTargetAndIndex(
          curElem,
          startPoint,
          prevLine
        );

        const targetNode = target.firstChild?.firstChild;
        if (!targetNode) return;

        start = targetNode;
        startPoint = index;
        setDirection("left");
      } else if (direction === "right") {
        console.log("방향성이 오른쪽인 경우");
        const { target, index } = getTargetAndIndex(
          curElem,
          endPoint,
          prevLine
        );

        const targetNode = target.firstChild?.firstChild;
        if (!targetNode) return;

        start = targetNode;
        startPoint = index;
        setDirection("left");
      }
    } else {
      // 시작 줄과 종료 줄이 다른 경우
      console.log("시작 줄과 종료 줄이 다름");
      if (direction === "left") {
        console.log("방향성이 왼쪽임");
        const { target, index } = getTargetAndIndex(
          curElem,
          startPoint,
          prevLine
        );

        const targetNode = target.firstChild?.firstChild;

        if (!targetNode) return;

        start = targetNode;
        startPoint = index;
        setDirection("left");
      } else {
        console.log("방향성이 오른쪽임");
        const { target, index } = getTargetAndIndex(
          curElem,
          endPoint,
          prevLine
        );

        const targetNode = target.firstChild?.firstChild;
        if (!targetNode) return;

        const targetLine = target.parentNode;
        if (!targetLine) return;

        if (targetLine === startLine) {
          console.log("목표 줄과 시작 줄이 같음");
          const position = start.compareDocumentPosition(targetNode);
          console.log(position);

          console.log(position);
          if (position === 0) {
            console.log("목표 노드가 시작 노드와 같음");
            if (startPoint <= index) {
              console.log("시작 위치가 목표 위치보다 작거나 같음");
              end = targetNode;
              endPoint = index;
              setDirection("right");
            } else {
              console.log("시작 위치가 목표 위치보다 큼");
              end = start;
              endPoint = startPoint;
              start = targetNode;
              startPoint = index;

              setDirection("left");
            }
          } else if (position === 2) {
            console.log("목표 노드가 시작 노드 앞에 옴");
            end = start;
            endPoint = startPoint;
            start = targetNode;
            startPoint = index;
            setDirection("left");
          } else if (position === 4) {
            console.log("목표 노드가 시작 노드 뒤에 옴");
            end = targetNode;
            endPoint = index;
            setDirection("right");
          }
        } else {
          console.log("목표 줄과 시작 줄이 다름");
          end = targetNode;
          endPoint = index;
          setDirection("right");
        }
      }
    }
  }

  range.setStart(start, startPoint);
  range.setEnd(end, endPoint);

  selection?.removeAllRanges();

  selection?.addRange(range);
};

const selectDown = (
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
    selection?.isCollapsed || direction === "right" ? end : start;

  // 현재 요소
  const curElem =
    focalNode.nodeType === Node.TEXT_NODE
      ? (focalNode.parentNode as HTMLElement)
      : (focalNode as HTMLElement);

  // 현재 줄
  const curLine =
    focalNode.nodeType === Node.TEXT_NODE
      ? (focalNode.parentNode?.parentNode?.parentNode as HTMLElement)
      : (focalNode.parentNode?.parentNode as HTMLElement);

  // 시작 줄
  const startLine =
    start.nodeType === Node.TEXT_NODE
      ? (start.parentNode?.parentNode?.parentNode as HTMLElement)
      : (start.parentNode?.parentNode as HTMLElement);
  // 종료 줄
  const endLine =
    end.nodeType === Node.TEXT_NODE
      ? (end.parentNode?.parentNode?.parentNode as HTMLElement)
      : (end.parentNode?.parentNode as HTMLElement);

  // 다음 줄
  const nextLine =
    focalNode.nodeType === Node.TEXT_NODE
      ? (focalNode.parentNode?.parentNode?.parentNode
          ?.nextSibling as HTMLElement)
      : (focalNode.parentNode?.parentNode?.nextSibling as HTMLElement);

  // 다음 줄이 없는 경우
  if (!nextLine) {
    console.log("다음 줄 없음");
    const lastNode = curLine.lastChild?.firstChild?.firstChild;
    if (!lastNode) return;
    const lastText = lastNode?.textContent || "";

    end = lastNode;
    endPoint = lastText.length;

    setDirection("right");
  } else {
    // 다음 줄이 있는 경우
    console.log("다음 줄 있음");
    if (startLine === endLine) {
      // 시작 줄과 종료 줄이 같은 경우
      console.log("시작 줄과 종료 줄이 같음");
      if (selection?.isCollapsed || direction === "right") {
        if (selection?.isCollapsed) console.log("시작 노드와 종료 노드가 같음");
        if (direction === "right") console.log("방향성이 오른쪽임");
        const { target, index } = getTargetAndIndex(
          curElem,
          endPoint,
          nextLine
        );

        const targetNode = target.firstChild?.firstChild;
        if (!targetNode) return;

        end = targetNode;
        endPoint = index;
      } else if (direction === "left") {
        console.log("방향성이 왼쪽임");

        const { target, index } = getTargetAndIndex(
          curElem,
          endPoint,
          nextLine
        );

        const targetNode = target.firstChild?.firstChild;
        if (!targetNode) return;

        end = targetNode;
        endPoint = index;
      }
      setDirection("right");
    } else {
      // 시작 줄과 종료 줄이 다른 경우
      console.log("시작 줄과 종료 줄이 다름");
      if (direction === "left") {
        console.log("방향성이 왼쪽임");

        const { target, index } = getTargetAndIndex(
          curElem,
          startPoint,
          nextLine
        );

        // 목표 노드
        const targetNode = target.firstChild?.firstChild;

        if (!targetNode) return;

        // 목표 줄
        const targetLine = target.parentNode;
        if (!targetLine) return;

        if (endLine === targetLine) {
          console.log("목표 줄과 종료 줄이 같음");

          const position = end.compareDocumentPosition(targetNode);

          // 목표 노드가 종료 노드와 같은 경우
          if (position === 0) {
            console.log("종료 노드와 목표 노드가 같음");
            if (endPoint <= index) {
              console.log("종료 위치과 목표 위치보다 크거나 같음");
              start = end;
              startPoint = endPoint;
              end = targetNode;
              endPoint = index;
            } else {
              console.log("종료 위치과 목표 위치보다 작음");
              start = targetNode;
              startPoint = index;
              end = end;
              endPoint = endPoint;
            }
          }
          // 목표 노드가 종료 노드보다 앞에 존재하는 경우
          else if (position === 2) {
            console.log("목표 노드가 종료 노드의 앞에 옴");
            start = targetNode;
            startPoint = index;
          } else if (position === 4) {
            // 목표 노드가 종료 노드보다 뒤에 존재하는 경우
            console.log("목표 노드가 종료 노드의 뒤에 옴");
            start = end;
            startPoint = endPoint;
            end = targetNode;
            endPoint = index;
          }
        } else {
          console.log("종료 줄과 목표 줄이 다름");
          start = targetNode;
          startPoint = index;
          end = end;
          endPoint = endPoint;
        }

        setDirection("left");
      } else {
        console.log("방향성이 오른쪽임");
        const { target, index } = getTargetAndIndex(
          curElem,
          endPoint,
          nextLine
        );

        const targetNode = target.firstChild?.firstChild;
        if (!targetNode) return;

        end = targetNode;
        endPoint = index;

        setDirection("right");
      }
    }
  }

  range.setStart(start, startPoint);
  range.setEnd(end, endPoint);

  selection?.removeAllRanges();
  selection?.addRange(range);
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
