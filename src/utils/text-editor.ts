import { validHashtag } from "../data";
import styles from "../pages/TextEditor/TextEditor.module.css";

const createNewLine = (e: React.KeyboardEvent<HTMLDivElement>) => {
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
const moveup = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const selection = window.getSelection();
  if (!selection) {
    console.log("selection이 없음");

    return;
  }
  console.log(selection);

  const focusNode = selection.focusNode as HTMLElement;
  const focusOffset = selection.focusOffset;

  if (!focusNode || focusOffset == undefined) {
    console.log("focusNode 또는 focusOffset 없음");
    return;
  }

  const length = focusNode.textContent ? focusNode.textContent.length : 0;

  // 문자를 감싸는 컨테이너
  const span = length === 0 ? focusNode : focusNode.parentElement;
  if (!span) return;

  const parent = span.parentElement;

  const prevLine = parent?.previousElementSibling;

  // 이전 줄이 존재하지 않으면 아무것도 하지 않음
  if (!prevLine) return;

  // 커서의 위치
  const x = getCursorPos(selection);

  // 이동할 요소와 요소의 left 좌표
  const { elem, xPos } = getPreviousLineElementByPosition(x, span);

  // 이동할 요소 내에서 이동할 위치 찾기 => 반환 값은 index?
  const index = getPosition(elem, x - xPos);

  const moveTo = elem;
  const pos = index;

  setCursorPosition(moveTo, pos);
};

// ↓ 방향키 사용시
const movedown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();

  const selection = window.getSelection();
  if (!selection) {
    console.log("selection이 없음");

    return;
  }

  const focusNode = selection.focusNode as HTMLElement;
  const focusOffset = selection.focusOffset;

  if (!focusNode || focusOffset == undefined) {
    console.log("focusNode 또는 focusOffset 없음");
    return;
  }

  const length = focusNode.textContent ? focusNode.textContent.length : 0;

  // 문자를 감싸는 컨테이너
  const span = length === 0 ? focusNode : focusNode.parentElement;

  if (!span) return;

  const parent = span.parentElement;

  const nextLine = parent?.nextElementSibling;

  // 다음 줄이 존재하지 않으면 아무것도 하지 않음
  if (!nextLine) return;

  // 커서의 위치
  const x = getCursorPos(selection);

  // 이동할 요소와 요소의 left 좌표
  const { elem, xPos } = getNextLineElementByPosition(x, span);

  // 이동할 요소 내에서 이동할 위치 찾기 => 반환 값은 index?
  const index = getPosition(elem, x - xPos);

  setCursorPosition(elem, index);
};

// ← 방향키 사용시
const moveLeft = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const selection = window.getSelection();
  if (!selection) return;
  const focusNode = selection.focusNode as HTMLElement;
  if (!focusNode) return;

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

  let prevSpan = span?.previousSibling as HTMLElement;

  // 현재요소에 따른 기준 변화
  // 이전 요소가 있고 현재 요소의 클래스가 link라면 기준점 1 아니면 0
  const focalPoint = curClassName.includes("link") && prevSpan ? 1 : 0;

  if (focusOffset > focalPoint) {
    setCursorPosition(focusNode, focusOffset - 1);
  }

  // 상하 이동으로 link 클래스의 0으로 이동하면 left 이동이 안되는 문제
  // 때문에 focusOffset === 0 추가
  if (focusOffset === focalPoint || focusOffset === 0) {
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

        setCursorPosition(childSpan, index);
      }
    }
  }
};

// → 방향키 사용시
const moveRight = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const selection = window.getSelection();
  if (!selection) return;
  const focusNode = selection.focusNode as HTMLElement;
  if (!focusNode) return;

  // 해당 요소의 텍스트 요소
  const textContent = focusNode.textContent;

  // 부모 요소(span)
  const span = textContent ? focusNode.parentElement : focusNode;

  // 현재 요소의 길이 구하기
  const length = textContent ? textContent.length : 0;

  // 현재 위치 구하기
  const focusOffset = selection.focusOffset;

  if (focusOffset < length) {
    setCursorPosition(focusNode, focusOffset + 1);
  }

  // 현재 위치가 현재 요소의 길이와 동일하다면 현재요소의 끝에 있다고 볼 수 있음
  if (focusOffset === length) {
    // 이웃 요소가 있는지 확인할 것
    let nextSpan = span?.nextSibling as HTMLElement;

    // 이웃 요소가 존재하는 경우
    if (nextSpan) {
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

      // 다음 줄이 있는 경우
      if (nextLine) {
        const childSpan = nextLine.children[0] as HTMLElement;

        setCursorPosition(childSpan, 0);
      }
    }
  }
};

// 커서 위치 찾기
const getCursorPos = (selection: Selection) => {
  const focusNode = selection.focusNode as HTMLElement;
  const focusOffset = selection.focusOffset;

  const length = focusNode.textContent ? focusNode.textContent.length : 0;

  if (!focusNode.parentElement) return 0;

  // 문자를 감싸는 컨테이너
  const span = length === 0 ? focusNode : focusNode.parentElement;

  // 해당 컨네이터의 좌측 좌표 구하기
  let x = span.getBoundingClientRect().left;

  // 컨테이너 내에서 커서 이전의 문자열 가져오기
  const text = focusNode.textContent || "";

  const textBeforeCursor = text ? text.slice(0, focusOffset) : "";

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!canvas || !context) return 0;

  const style = window.getComputedStyle(span);

  const font = style.font;

  context.font = font;

  // 문자열의 길이 계산
  const width = context.measureText(textBeforeCursor).width;

  x += width;

  return x;
};

// 위치로 다음 줄 요소 찾기
const getNextLineElementByPosition = (x: number, curElem: HTMLElement) => {
  let elem = undefined;
  let xPos = undefined;
  // 줄 요소 찾기
  const line = curElem.parentElement;
  // 현재 위치 고수
  const length = curElem.textContent ? curElem.textContent.length : 0;

  if (!line) {
    elem = curElem;
    xPos = length;
    return { elem, xPos };
  }
  // 다음 줄 찾기
  const nextLine = line.nextElementSibling;

  // 다음 줄이 있는 경우
  if (nextLine) {
    // 다음 줄의 자식 요소
    const spans = nextLine.children;

    // 자식 요소들의 left의 합
    xPos = 0;

    let i = 0;
    let chosen = 0;
    // 자식 요소들의 left의 합이 커서의 위치보다 클 때 까지
    while (xPos <= x && spans[i]) {
      const child = spans[i];

      const left = child.getBoundingClientRect().left;

      if (left > x) {
        chosen = i - 1;
        xPos = spans[i - 1].getBoundingClientRect().left;
        break;
      } else if (i === spans.length - 1) {
        chosen = i;
        xPos = left;
        break;
      }

      xPos = left;
      i++;
    }

    elem = spans[chosen];

    return { elem: elem as HTMLElement, xPos };
    // 다음 줄이 없는 경우
  } else {
    elem = curElem;
    xPos = length;
    return { elem, xPos };
  }
};

// 좌표로 이전 줄 요소 찾기
const getPreviousLineElementByPosition = (x: number, curElem: HTMLElement) => {
  let elem = undefined;
  let xPos = undefined;
  // 줄 요소 찾기
  const line = curElem.parentElement;
  // 현재 위치 고수
  const length = curElem.textContent ? curElem.textContent.length : 0;

  if (!line) {
    elem = curElem;
    xPos = length;
    return { elem, xPos };
  }
  // 다음 줄 찾기
  const prevLine = line.previousElementSibling;

  // 다음 줄이 있는 경우
  if (prevLine) {
    // 다음 줄의 자식 요소
    const spans = prevLine.children;

    // 자식 요소들의 left의 합
    xPos = 0;

    let i = 0;
    let chosen = 0;
    // 자식 요소들의 left의 좌표 커서의 위치보다 클 때 까지
    while (xPos <= x && spans[i]) {
      const child = spans[i];

      const left = child.getBoundingClientRect().left;

      if (left > x) {
        chosen = i - 1;
        xPos = spans[i - 1].getBoundingClientRect().left;
        break;
      } else if (i === spans.length - 1) {
        chosen = i;
        xPos = left;
        break;
      }

      xPos = left;
      i++;
    }

    elem = spans[chosen];

    // 다음 줄이 없는 경우
  } else {
    elem = curElem;
    xPos = length;
  }

  return { elem: elem as HTMLElement, xPos };
};

// 요소 내 위치 찾기
const getPosition = (elem: HTMLElement, pos: number) => {
  let index = 0;
  // 요소 내 문자열
  const text = elem.textContent || "";

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!canvas || !context) {
    index = 0;
    return index;
  }

  const style = window.getComputedStyle(elem);

  const font = style.font;

  context.font = font;

  for (let i = 0; i <= text.length; i++) {
    // 문자열을 순서대로
    const cut = text.slice(0, i);

    // 해당 문자열의 길이
    const width = context.measureText(cut).width;

    if (width >= pos) {
      const iB4 = i > 0 ? i - 1 : 0;
      const cutB4 = text.slice(0, iB4);

      const widthB4 = context.measureText(cutB4).width;

      if (width - pos <= pos - widthB4) {
        index = i;
      } else {
        index = i - 1;
      }

      break;
    } else {
      index = text.length;
    }
  }

  return index;
};

// hashtag class 생성 가능 여부 확인하기
const isHashtag = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();

  const selection = window.getSelection();
  if (!selection) return;

  // 현재 요소
  const focusNode = selection.focusNode as HTMLElement;
  if (!focusNode) return;

  // 현재 요소의 텍스트
  const text = focusNode.textContent;

  // 텍스트의 길이
  const length = text ? text.length : 0;

  // 텍스트의 마지막 문자
  const last = text ? text[length - 1] : "";

  const container = text ? (focusNode.parentElement as HTMLElement) : focusNode;

  // 빈문자 열 정규 표현식
  const space = /\s/;
  if (space.test(last)) {
    console.log("hi");
    // 해시태그 생성
    createHashtag(container);
  }
};

// hashtag 클래스 생성하기
const createHashtag = (container: HTMLElement) => {
  const span = document.createElement("span");
  span.setAttribute("class", `${styles.link} ${styles.hashtag}`);
  span.setAttribute("contentEditable", "true");
  span.innerText = "#";

  // onInput 이벤트 핸들러 추가
  span.addEventListener("input", (e: Event) =>
    checkValidHashtag(e as InputEvent)
  );

  container.after(span);
  setCursorPosition(span, 1);
};

// hashtag 유효성 확인하기
const checkValidHashtag = (e: InputEvent) => {
  const target = e.target as HTMLElement;

  // 해시태그 안의 문자열
  const text = target.innerText;
  console.log("해시태그 안의 문자열", text);

  // 문자열의 유효성 검사
  const isValid = validHashtag.test(text);

  // 유효하지 않는 문자가 들어오면 사이 span 생성
  if (!isValid) {
    // 마지막 문자를 가져 처음 문자로 삽입함
    createBetweenSpan(target);

    // 마지막에 입력한 문자를 삭제하고 유효한 문자열만 남김
    const validText = text.slice(0, text.length - 1);

    target.innerText = validText;
  }
};

// 사이 span 생성하기
const createBetweenSpan = (container: HTMLElement) => {
  // 이전 요소의 문자열
  const text = container.innerText;
  // 이전 문자열의 마지막 문자
  const last = text.slice(-1, text.length);

  const span = document.createElement("span");
  span.setAttribute("class", `${styles.span} ${styles.between}`);
  span.setAttribute("contentEditable", "true");

  // 마지막 문자가 공백문자가 아니면 문자 삽입
  const regExp = /\s/;
  if (!regExp.test(last)) span.innerText = last;

  container.after(span);
  setCursorPosition(span, 1);
};

// mention 클래스 생성 가능 여부 확인하기
const isMention = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();

  const selection = window.getSelection();
  if (!selection) return;

  // 현재 요소
  const focusNode = selection.focusNode as HTMLElement;
  if (!focusNode) return;

  // 현재 요소 내부의 텍스트
  const text = focusNode.textContent;

  // 현재 요소를 감싸고 있는 span 확인
  const container = text ? (focusNode.parentElement as HTMLElement) : focusNode;

  // 멘션 생성 가능 여부 확인하기

  // 멘션 클래스 생성하기
  createMention(container);
};
// mention 클래스 생성
const createMention = (container: HTMLElement) => {
  const span = document.createElement("span");
  span.setAttribute("class", `${styles.link} ${styles.mention}`);
  span.setAttribute("contentEditable", "true");
  span.innerText = "@";

  container.after(span);
  setCursorPosition(span, 1);
};

// url 클래스 생성 가능 여부 확인
const isURL = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const selection = window.getSelection();
  if (!selection) return;

  // 현재 요소
  const focusNode = selection.focusNode as HTMLElement;
  if (!focusNode) return;

  // 현재 요소 내부의 텍스트
  const text = focusNode.textContent || "";

  // 현재 요소를 감싸고 있는 span 확인
  const container = text ? (focusNode.parentElement as HTMLElement) : focusNode;

  // url 클래스 생성 가능 여부 확인 하기
  const url = text.match(/^\s.+$/)?.input || "";

  if (!url) return;
  // url 클래스 생성하기
  createUrl(container);
};

// url 클래스 생성
const createUrl = (container: HTMLElement) => {
  const span = document.createElement("span");
  span.setAttribute("class", `${styles.link} ${styles.url}`);
  span.setAttribute("contentEditable", "true");

  const text = container.textContent;
  console.log(text);

  if (!text) return;
  const url = text.match(/^\s.+$/)?.input || "";

  // 기존 요소에서 url에 쓰일 요소만 빼고 삭제해야함

  // 빼온 텍스트를 붙여줌
  const added = url + ".";
  span.innerText = added;

  const length = added.length;
  container.after(span);
  setCursorPosition(span, length);
};

export {
  createNewLine,
  moveup,
  movedown,
  moveLeft,
  moveRight,
  isHashtag,
  createHashtag,
  isMention,
  isURL,
};
