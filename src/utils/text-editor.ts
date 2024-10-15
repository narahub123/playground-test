import styles from "../pages/TextEditor/TextEditor.module.css";

export const createNewLine = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault(); // keydown 이벤트 전체에 적용하면 f5같은 기능이 먹히지 않음 주의할 것

  // 현재 선택된 요소 찾기
  const selection = window.getSelection();

  if (!selection) return;

  // 현재 커서가 있는 span
  const focusNode = selection.focusNode;
  console.log("현재 선택된 요소", focusNode);

  if (!focusNode) return;
  // 현재 커서가 있는 span의 부모 요소
  const parent = focusNode.parentElement;
  console.log("현재 선택된 요소의 부모 요소 ", parent);

  const div = document.createElement("div");
  div.setAttribute("class", styles.line);

  const span = document.createElement("span");
  span.setAttribute("class", styles.span);
  span.setAttribute("contentEditable", "true");

  div.appendChild(span);

  // 현재 선택된 요소의 다음에 새로운 라인 생성
  parent?.after(div);

  span.focus();
};

// 현재의 절대 위치 찾기 : 이전 요소들의 길이 + 현재 요소 내에서의 위치
const calcAbsolutePos = () => {
  let totalLength = 0;

  const selection = window.getSelection();
  if (!selection) return 0;

  // 현재 요소
  const focusNode = selection.focusNode;
  if (!focusNode) return 0;

  // 현재 요소 내에서의 위치 (현재 커서 위치)
  const focusOffset = selection.focusOffset;
  totalLength += focusOffset;

  // 현재 요소가 텍스트 노드인지 확인 후, 그에 맞는 부모 요소를 찾음
  const parent =
    focusNode.nodeType === Node.TEXT_NODE
      ? focusNode.parentElement
      : (focusNode as HTMLElement);

  // 부모 요소의 이전 형제 요소를 탐색하여 길이 합산
  let prevSibling = parent?.previousElementSibling;

  while (prevSibling) {
    const textContent = prevSibling.textContent;

    if (textContent) {
      totalLength += textContent.length;
    }

    // 다음 이전 형제로 이동
    prevSibling = prevSibling.previousElementSibling;
  }

  console.log("Total length from previous siblings: ", totalLength);
  return totalLength;
};

// 이동할 요소와 이동할 요소 내에서의 위치 찾기
const findElementToMove = (absPos: number, prevSibling: HTMLElement) => {
  let totalLength = absPos; // 절대 위치
  const children = prevSibling.children; // 형제 요소의 자식들
  let returnChild = null;
  let curPos = 0;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const textContent = child.textContent || ""; // null일 수 있으니 기본값 설정

    const length = textContent.length;

    // 현재 자식 요소의 텍스트 길이가 남은 위치보다 큰 경우
    if (totalLength <= length) {
      returnChild = child;
      curPos = totalLength; // 현재 자식 요소에서의 상대적인 위치
      break;
    } else {
      // 남은 위치에서 현재 자식 요소의 길이만큼 차감
      totalLength -= length;

      // 마지막 자식 요소일 때 남은 위치 처리
      if (i === children.length - 1) {
        returnChild = child;
        curPos = length; // 마지막 자식이므로 커서는 마지막 위치에 설정
      }
    }
  }

  return { elem: returnChild as HTMLElement, index: curPos };
};

// 커서 위치 지정하기
const setCursorPosition = (element: HTMLElement, index: number) => {
  const range = document.createRange();
  console.log("range 객체", range);

  range.setStart(
    element.childNodes[0] || element,
    Math.min(index, element.textContent?.length || 0)
  );

  range.collapse(true);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
};

// ↑ 방향키 사용시
export const moveup = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();

  const selection = window.getSelection();

  const focusNode = selection?.focusNode as HTMLElement;
  const focusOffset = selection?.focusOffset;
  console.log("현재의 커서의 위치", focusOffset);

  const length = focusNode.textContent ? focusNode.textContent.length : 0;
  console.log("문자열 길이", length);

  const absoluteLength = calcAbsolutePos();
  console.log("절대 위치", absoluteLength);

  // 문자열의 길이에 따른 부모 지정 변경
  const parent =
    length === 0
      ? focusNode?.parentElement
      : focusNode?.parentElement?.parentElement;
  const prevSibling = parent?.previousElementSibling as HTMLElement;

  if (!prevSibling) return;

  // 이동해야 할 요소 알아내기
  const { elem, index } = findElementToMove(absoluteLength, prevSibling);

  console.log("현재 요소", focusNode);
  console.log("부모요소", parent);
  console.log("다음 요소", prevSibling);
  console.log("이동할 요소", elem);
  console.log("이동할 위치", index);

  setCursorPosition(elem, index);
};

// ↓ 방향키 사용시
export const movedown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();

  const selection = window.getSelection();
  const focusNode = selection?.focusNode as HTMLElement;
  const focusOffset = selection?.focusOffset;
  console.log("현재의 커서의 위치", focusOffset);

  const length = focusNode.textContent ? focusNode.textContent.length : 0;
  console.log("문자열 길이", length);

  const absoluteLength = calcAbsolutePos();
  console.log("절대 위치", absoluteLength);

  // 문자열의 길이에 따른 부모 지정 변경
  const parent =
    length === 0
      ? focusNode?.parentElement
      : focusNode?.parentElement?.parentElement;
  const nextSibling = parent?.nextElementSibling as HTMLElement;

  if (!nextSibling) return;

  // 이동해야 할 요소 알아내기
  const { elem, index } = findElementToMove(absoluteLength, nextSibling);

  console.log("현재 요소", focusNode);
  console.log("부모요소", parent);
  console.log("다음 요소", nextSibling);

  setCursorPosition(elem, index);
};

// ← 방향키 사용시
export const moveLeft = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const selection = window.getSelection();
  if (!selection) return;
  const focusNode = selection.focusNode as HTMLElement;
  if (!focusNode) return;
  console.log("현재 요소", focusNode);

  // 해당 요소의 텍스트 요소
  const textContent = focusNode.textContent;

  if (!focusNode.parentElement) return;
  // span 요소(span)
  const span = textContent ? focusNode.parentElement : focusNode;

  // line 요소
  const line = span?.parentElement;

  // 현재 위치 구하기
  const focusOffset = selection.focusOffset;

  // 현재 요소의 클래스 이름
  const curClassName = span.className;
  console.log("현재 요소의 클래스 이름", curClassName);

  let prevSpan = span?.previousSibling as HTMLElement;

  // 현재요소에 따른 기준 변화
  // 이전 요소가 있고 현재 요소의 클래스가 link라면 기준점 1 아니면 0
  const focalPoint = curClassName.includes("link") && prevSpan ? 1 : 0;

  console.log("기준점", focalPoint);

  if (focusOffset > focalPoint) {
    setCursorPosition(focusNode, focusOffset - 1);
  }

  if (focusOffset === focalPoint) {
    // 이전 이웃이 있는 경우
    if (prevSpan) {
      const length = prevSpan.textContent ? prevSpan.textContent.length : 0;

      setCursorPosition(prevSpan, length);

      // 이전 이웃이 없는 경우
    } else {
      const prevLine = line?.previousElementSibling;

      // 이전 줄이 존재하는 경우
      if (prevLine) {
        const length = prevLine.children.length;
        const childSpan = prevLine.children[length - 1] as HTMLElement;
        const index = childSpan.textContent ? childSpan.textContent.length : 0;

        console.log("길이", index);

        setCursorPosition(childSpan, index);
      }
    }
  }
};
// → 방향키 사용시
export const moveRight = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const selection = window.getSelection();
  if (!selection) return;
  const focusNode = selection.focusNode as HTMLElement;
  if (!focusNode) return;
  console.log("현재 요소", focusNode);

  // 해당 요소의 텍스트 요소
  const textContent = focusNode.textContent;

  // 부모 요소(span)
  const span = textContent ? focusNode.parentElement : focusNode;

  // 현재 요소의 길이 구하기
  const length = textContent ? textContent.length : 0;
  console.log(length);

  // 현재 위치 구하기
  const focusOffset = selection.focusOffset;
  console.log("현재 위치", focusOffset);

  if (focusOffset < length) {
    setCursorPosition(focusNode, focusOffset + 1);
  }

  // 현재 위치가 현재 요소의 길이와 동일하다면 현재요소의 끝에 있다고 볼 수 있음
  if (focusOffset === length) {
    // 이웃 요소가 있는지 확인할 것
    let nextSpan = span?.nextSibling as HTMLElement;

    // 이웃 요소가 존재하는 경우
    if (nextSpan) {
      console.log("클래스 이름", nextSpan.className);
      const nextClassName = nextSpan.className;

      // 클래스가 hashtag나 mention인 경우
      if (nextClassName.includes("link")) {
        setCursorPosition(nextSpan, 1);
      } else {
        setCursorPosition(nextSpan, 0);
      }

      // 이웃 요소가 존재하지 않는 경우
    } else {
      // 줄 요소
      const line = span?.parentElement;

      // 다음 줄
      const nextLine = line?.nextElementSibling;

      console.log("다음줄", nextLine);

      // 다음 줄이 있는 경우
      if (nextLine) {
        const childSpan = nextLine.children[0] as HTMLElement;

        console.log("다음줄의 첫번째 span", childSpan);

        setCursorPosition(childSpan, 0);
      }
    }
  }
};
