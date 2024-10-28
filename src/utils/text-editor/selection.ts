import { getCurElement } from "./get";

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

export { selectRight };
