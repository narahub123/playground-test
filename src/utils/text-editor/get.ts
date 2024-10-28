// 요소와 문자열을 통해서 x 좌표 구하기
const getXCoord = (curElem: HTMLElement, text: string) => {
  let x = 0;

  // 현재 요소의 left 좌표 알아내기
  x += curElem.getBoundingClientRect().left;
  console.log("현재요소의 left 좌표", curElem.getBoundingClientRect().left);

  x += getTextWidth(curElem, text);
  console.log("커서 이전 문자열의 너비", getTextWidth(curElem, text));

  return x;
};

// x좌표를 통해서 특정 줄로 이동할 때 이동할 요소와 해당 요소의 left 좌표 구하기
const getTargetAndRemainedLength = (x: number, line: HTMLElement) => {
  let target = line.firstElementChild as HTMLElement;
  let leftPosition = line.firstElementChild?.getBoundingClientRect().left || 0;

  // line의 자식 요소
  const children = [...line.children] as HTMLElement[];

  for (const child of children) {
    // 자식 요소의 left 좌표
    const leftOfChild = child.getBoundingClientRect().left;

    // 현재 커서의 위치가 자식 요소의 left 좌표 보다 작을 때
    if (x <= leftOfChild) {
      break;
    }

    target = child;
    leftPosition = leftOfChild;
  }

  return {
    target, // 이동할 요소
    length: x - leftPosition, // 남은 길이
  };
};

// 이동할 요소와 남은 길이을 이용해 이동할 요소에서의 위치 알아내기
const getIndexInTarget = (target: HTMLElement, length: number) => {
  let index = 0;
  const text = target.textContent || "";

  for (let i = 1; i <= text.length; i++) {
    // 검사할 문자열
    const cut = text.slice(0, i);

    // 검사할 문자열의 너비
    const width = getTextWidth(target, cut);

    // 남은 길이가 문자열의 너비보다 작은 경우
    if (length < width) {
      const prevCut = text.slice(0, i - 1);
      const prevWidth = getTextWidth(target, prevCut);
      // 현재 커서에서 현재 검사하는 문자열의 문자열 다음 커서와
      // 이전에 검사한 문자열 다음 커서와의 거리를 비교해서
      // 현재 검사하는 문자열 뒤의 커서가 더 가까우면 현재 검사 문자열 다음으로 커서 이동
      if (width - length <= length - prevWidth) {
        index = i;
      }

      // 검사를 종료함
      break;
    }

    index = i;
  }

  return index;
};

// 문자열의 너비 구하기
const getTextWidth = (curElem: HTMLElement, text: string) => {
  let width = text.length;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return width;

  // 현재 요소의 스타일 알아내기
  const style = window.getComputedStyle(curElem);

  // context에 현재요소의 font 삽입하기
  context.font = style.font;

  width = context.measureText(text).width;

  return width;
};

// 이동할 요소와 위치 알아내기
const getTargetAndIndex = (
  curElem: HTMLElement, // 현재 요소
  cursorPosition: number, //
  line: HTMLElement // 이동할 줄
) => {
  // 현재 요소 내의 문자열
  const curText = curElem.textContent || "";

  // 커서 이전의 문자열
  const text = curText.slice(0, cursorPosition);

  // 커서의 x 좌표 알아내기
  const x = getXCoord(curElem, text);

  // 커서의 x 좌표에 대응하는 line에서의 요소와 x좌표에서 요소의 left 좌표을 뺀 길이 구하기
  const { target, length } = getTargetAndRemainedLength(x, line);

  // 대응하는 요소 내의 위치 알아내기
  const index = getIndexInTarget(target, length);

  //이동할 요소가 link이고 인덱스가 0이면서 이전 요소가 있는 경우
  if (
    target.firstElementChild?.className.includes("link") &&
    index === 0 &&
    target.previousElementSibling
  ) {
    const prevElem = target.previousElementSibling
      .firstElementChild as HTMLElement;
    const prevText = prevElem?.textContent || "";

    return {
      target: prevElem,
      index: prevText.length,
    };
  }

  return {
    target,
    index,
  };
};

const getCurElement = () => {
  const selection = window.getSelection();

  // 현재 노드
  const curNode = selection?.focusNode;

  // 현재 커서 위치
  const curPosition = selection?.focusOffset || 0;

  // 시작 노드
  const startNode = selection?.anchorNode;

  // 시작 위치
  const startOffset = selection?.anchorOffset || 0;

  // 종료 노드
  const endNode = selection?.focusNode;

  // 종료 위치
  const endOffset = selection?.focusOffset || 0;

  // 현재 노드의 문자열
  const curText = curNode?.textContent || "";

  // 현재 요소 : 클래스가 있는 곳
  const curElem =
    curNode?.nodeType === Node.TEXT_NODE
      ? curNode?.parentElement
      : (curNode as HTMLElement);

  // 현재 요소의 클래스
  const curClassName = curElem?.className;

  // 현재 컨테이너
  const curContainer = curElem?.parentElement;

  // 현재 줄
  const curLine = curContainer?.parentElement;

  // 컨텐트
  const content = curLine?.parentElement;

  // 이전 컨테이너
  const prevContainer = curContainer?.previousElementSibling as HTMLElement;

  // 이전 요소
  const prevElem = prevContainer?.firstElementChild as HTMLElement;

  // 이전 요소의 문자열
  const prevText = prevElem?.textContent || "";

  // 다음 컨테이너
  const nextContainer = curContainer?.nextElementSibling as HTMLElement;
  // 다음 요소
  const nextElem = nextContainer?.firstChild as HTMLElement;
  // 다음 노드
  const nextNode = nextElem?.firstChild;
  // 다음 문자열
  const nextText = nextElem?.textContent || "";

  // 다음 요소 클래스
  const nextClassName = nextElem?.className;

  // 이전 줄
  const prevLine = curLine?.previousElementSibling as HTMLElement;
  // 이전 줄 마지막 컨테이너
  const prevLastContainer = prevLine?.lastElementChild as HTMLElement;
  // 이전 줄 마지막 요소
  const prevLastElem = prevLastContainer?.firstChild as HTMLElement;
  // 이전 줄 마지막 요소의 문자열
  const prevLastText = prevLastElem?.textContent || "";

  // 다음 줄
  const nextLine = curLine?.nextElementSibling as HTMLElement;

  // 다음 줄 첫 컨테이너
  const nextFirstContainer = nextLine?.firstElementChild as HTMLElement;

  // 다음 줄 첫 요소
  const nextFirstElem = nextFirstContainer?.firstChild as HTMLElement;

  // 다음 줄 첫 노드
  const nextFirstNode = nextFirstElem?.firstChild;

  return {
    selection,
    curNode,
    curPosition,
    curText,
    curElem,
    curClassName,
    curLine,
    prevElem,
    prevText,
    prevLastElem,
    prevLastText,
    prevLine,
    nextContainer,
    nextElem,
    nextNode,
    nextText,
    nextClassName,
    nextFirstElem,
    nextFirstNode,
    nextLine,
    content,
    startNode,
    startOffset,
    endNode,
    endOffset,
  };
};
export {
  getXCoord,
  getTargetAndRemainedLength,
  getIndexInTarget,
  getTargetAndIndex,
  getCurElement,
};
