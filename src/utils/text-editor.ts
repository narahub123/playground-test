import { validHashtag, validMention, validURL } from "../data";
import { Hashtag } from "../pages";
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

// normal span 클래스 생성
const createNormalSpan = (container: HTMLElement, text: string = "") => {
  const span = document.createElement("span");
  span.setAttribute("class", `${styles.span} ${styles.normal}`);
  span.setAttribute("contentEditable", "true");
  span.innerText = text;

  container.after(span);

  return span;
};

// gap span 클래스 생성
const createGapSpan = (container: HTMLElement, text: string = "") => {
  const span = document.createElement("span");
  span.setAttribute("class", `${styles.span} ${styles.gap}`);
  span.setAttribute("contentEditable", "true");
  span.innerText = text;

  container.after(span);

  return span;
};

const createLinkClass = (
  container: HTMLElement,
  text: string,
  className: string
) => {
  const classname =
    className === "mention"
      ? styles.mention
      : className === "hashtag"
      ? styles.hashtag
      : className === "url"
      ? styles.url
      : "";

  const span = document.createElement("span");
  span.setAttribute("class", `${styles.link} ${classname}`);
  span.setAttribute("contentEditable", "true");

  span.innerText = text;

  // onInput 이벤트 핸들러 추가
  span.addEventListener("input", () => checkValidLink());

  container.after(span);

  return span;
};

// 현재 요소에 link 클래스에 적합한 것이 있는지 확인
const hasLink = () => {
  const validLink = isLink();

  if (validLink) {
    const { container, curText, cursorPos } = getContainerElement();

    if (!container) return;

    // 커서 위치 지정을 위한 변수들
    let cursorElement = container;
    let cursorText = "";

    const validation =
      validLink === "hashtag"
        ? validHashtag
        : validLink === "mention"
        ? validMention
        : validLink === "url"
        ? validURL
        : undefined;

    if (!validation) return;

    // 유효한 문자열 배열
    const valid = curText.match(validation) as RegExpMatchArray;
    console.log("유효한 문자열 배열", valid);

    // 이후 문자열
    let lastIndex = 0;
    while (validation.exec(curText) !== null) {
      lastIndex = validation.lastIndex;
    }
    const textAfter = curText.slice(lastIndex);

    console.log("이후 문자열", textAfter);

    // 이후 문자열이 있는 경우
    if (textAfter) {
      let nextContainer: HTMLElement;
      // 공백 문자로 시작하는 경우
      if (checkSpace(textAfter)) {
        nextContainer = createGapSpan(container, textAfter.slice(1));
      } else {
        // 공백 문자로 시작하지 않는 경우
        nextContainer = createNormalSpan(container, textAfter);
      }

      const nextSibling = nextContainer.nextElementSibling;
      const nextClassName = nextSibling?.className || "";

      // 이후 문자열을 감싸는 요소 다음에 span 클래스가 존재하는지 확인
      if (nextSibling && nextClassName.includes("span")) {
        // 존재하는 경우 이전 요소의 text를 가져와서 합치고 해당 요소는 삭제함
        const nextText = nextSibling.textContent || "";

        nextContainer.innerText =
          textAfter + nextClassName.includes("gap") ? " " : "" + nextText;

        nextSibling.remove();
      }
    }

    // mention 클래스 생성하기
    for (let i = valid.length - 1; i >= 0; i--) {
      const text = valid[i];
      console.log("유효한 문자열", text);

      const link = createLinkClass(container, text, validLink);

      if (!link) return;
      // text가 가장 나중 문자열인 경우
      if (i === valid.length - 1) {
        // 다음 요소 확인
        const nextSpan = link.nextElementSibling;
        if (nextSpan && nextSpan.className.includes("link")) {
          createNormalSpan(link, "");
        }
      }
      if (i === 0 && valid.length === 1) {
        // 유효한 문자열이 하나만 존재한는 경우
        cursorElement = link;
        cursorText = text;
      }

      // 사이 문자열

      const textBetween =
        valid.length > 1 && i > 0
          ? curText.split(valid[i - 1])[1].split("@")[0]
          : "";
      console.log("사이 문자열", textBetween ? textBetween : "없음");

      if (textBetween) {
        if (checkSpace(textBetween)) {
          // 공백이 있는 경우: gap span 생성
          const gap = createGapSpan(container, textBetween.slice(1));
          cursorElement = gap;
          cursorText = textBetween.slice(1);
        } else {
          // 공백이 없는 경우 : normal span 생성
          const normal = createNormalSpan(container, textBetween);
          cursorElement = normal;
          cursorText = textBetween;
        }
      }
    }

    // 이전 문자열
    const index = validation.exec(curText)?.index;
    const textBefore = curText.slice(0, index);
    console.log("이전 문자열", textBefore);
    // 이전 문자열은 기존 요소에 삽입
    container.innerText = textBefore;

    if (textBefore && textBefore.length >= cursorPos) {
      // 요소 지정
      cursorElement = container;
      // 커서 위치 지정
      cursorText = textBefore;
    } else if (!textBefore) {
      // 이전 문자열이 없는 경우
      const prevSibling = container.previousElementSibling;
      // 이전 요소가 없는 경우
      if (!prevSibling) {
        // 해당 요소 삭제
        container.remove();
      }
    }

    setCursorPosition(cursorElement, cursorText.length);
  }
};

const isLink = () => {
  const { container, curText } = getContainerElement();
  if (!container) return "";

  console.log("적용되는 정규 표현식", validURL);

  const hashtag = validHashtag.test(curText);

  console.log(`유효한 hashtag 존재 ${hashtag ? "함" : "안함"}`);

  // 유효한 문자열이 있는지 확인
  const mention = validMention.test(curText);

  console.log(`유효한 mention 존재 ${mention ? "함" : "안함"}`);

  const url = validURL.test(curText);

  console.log(`유효한 url 존재 ${url ? "함" : "안함"}`);

  const isValid = hashtag ? "hashtag" : mention ? "mention" : url ? "url" : "";

  return isValid;
};

// 현재 요소 안에 url에 적합한 문자열이 있는지 확인
const hasUrl = () => {
  const { container, curText } = getContainerElement();
  if (!container) return "";

  console.log("적용되는 정규 표현식", validURL);

  const isValid = validURL.test(curText);

  console.log(`유효한 url 존재 ${isValid ? "함" : "안함"}`);

  return isValid ? "url" : "";
};

// 현재 요소 안에 해시태그에 적합한 문자열이 있는지 확인
const hasHashtag = () => {
  const { container, curText } = getContainerElement();

  if (!container) return "";

  console.log("적용되는 정규 표현식", validHashtag);

  const isValid = validHashtag.test(curText);

  console.log(`유효한 hashtag 존재 ${isValid ? "함" : "안함"}`);

  return isValid ? "hashtag" : "";
};

// 현재 요소가 멘션에 적합한 문자열이 있는지 확인
const hasMention = () => {
  const { container, curText } = getContainerElement();

  if (!container) return "";

  // 유효성을 검사하는 현재 텍스트
  console.log("유효성 검사 텍스트", curText);

  // 적용되는 정규 표현식
  console.log("적용되는 정규 표현식", validMention);

  // 유효한 문자열이 있는지 확인
  const isValid = validMention.test(curText);

  console.log(`유효한 mention 존재 ${isValid ? "함" : "안함"}`);

  return isValid ? "mention" : "";
};

const checkValidLink = () => {
  const { container, curText, cursorPos } = getContainerElement();

  if (!container) return;

  // 링크 클래스 내에서의 유효성 검사이기 때문에 링크 클래스가 아닌 경우 적용 안됨
  if (!container.className.includes("link")) return;

  let cursorElement = container;
  let cursorLength = curText.length;

  // 이전 요소
  const prevSibling = container.previousElementSibling as HTMLElement;
  const prevText = prevSibling?.textContent || "";

  // 이후 요소
  const nextSibling = container.nextElementSibling as HTMLElement;
  const nextText = nextSibling?.textContent || "";
  console.log("이후 요소의 문자열", nextText);

  const className = container.className;
  const validation = className.includes("mention")
    ? validMention
    : className.includes("hashtag")
    ? validHashtag
    : className.includes("url")
    ? validURL
    : "";
  // 멘션 클래스 내 유효성 충족하는 문자열의 배열
  const matchArr = curText.match(validation);
  console.log("멘션 클래스 내 유효성 충족하는 문자열의 배열", matchArr);

  // 유효성을 충족하지 않는 부분
  const unmatched = curText.slice(matchArr?.[0].length);

  // 멘션 클래스 내에 유효성을 충족하는 문자열이 없는 경우
  if (!matchArr) {
    // 멘션 클래스 삭제
    container.removeAttribute("class");

    let combinedText = curText;
    console.log(combinedText);

    // 이후 요소가 존재하고 span 클래스라면 병합
    if (nextSibling && nextSibling.className.includes("span")) {
      combinedText =
        curText + (nextSibling.className.includes("gap") ? " " : "") + nextText;

      nextSibling.remove();
    }

    // 이전 요소가 있고 span 클래스라면 병합
    if (prevSibling && prevSibling.className.includes("span")) {
      // 이전 요소의 텍스트와 현재 텍스트와 병합
      combinedText = prevText + combinedText;
      // 합친 텍스트를 이전 요소에 삽입
      prevSibling.innerText = combinedText;

      // 현재 클래스 삭제
      container.remove();
      cursorElement = prevSibling;
      cursorLength = combinedText.length + cursorPos;
    } else if (!prevSibling) {
      container.innerText = combinedText;

      container.setAttribute("class", `${styles.span} ${styles.normal}`);
      cursorElement = container;
      cursorLength = cursorPos;
    }
  } else if (unmatched) {
    // 멘션 클래스 내에 유효성을 충족하는 문자열의 배열이 있는 경우
    // 유효성을 충족하는 부분은 그대로 남기로 충족하지 않는 부분만 span으로 넘김
    console.log("유효성을 충족하지 않는 부분", unmatched);

    // 문자열 공백 문자로 시작하면 제거하고 아니며 그대로
    let newText = checkSpace(unmatched) ? unmatched.slice(1) : unmatched;
    console.log(newText);

    // 이후 요소가 존재하고 이후 요소가 span 클래스인 지 확인
    if (nextSibling && nextSibling.className.includes("span")) {
      // 유효성을 충족하지 않은 문자열과 다음 요소의 문자열을 병합
      newText += (nextSibling.className.includes("gap") ? " " : "") + nextText;

      // 이후 요소 삭제
      nextSibling.remove();
    }

    // 유효성을 충족하지 않는 문자열이 공백문자로 시작하는지 확인
    if (checkSpace(unmatched)) {
      // 공백문자로 시작하는 경우 : gap span 생성
      const gap = createGapSpan(container, newText);

      cursorElement = gap;
      cursorLength = 0;
    } else {
      // 공백문자로 시작하지 않는  경우 : normal 생성
      const normal = createNormalSpan(container, newText);

      cursorElement = normal;
      cursorLength = 1;
    }

    // 현재 요소에 유효성 적합한 문자열만 포함
    container.innerText = matchArr[0];
  }

  setCursorPosition(cursorElement, cursorLength);
};

// 공백 문자로 시작하는지 여부 확인
const checkSpace = (text: string) => {
  return /^\s/.test(text);
};

// 문자열 감싸고 있는 요소 찾기
const getContainerElement = () => {
  const selection = window.getSelection();
  if (!selection) return { container: undefined, curText: "" };

  // 현재 요소
  const focusNode = selection.focusNode as HTMLElement;
  if (!focusNode) return { container: undefined, curText: "" };
  const focusOffset = selection.focusOffset;

  // 현재 요소 내의 문자열
  const text = focusNode.textContent || "";

  // 현재 요소의 클래스 이름
  const className = focusNode.className;

  // 현재 요소를 감싸는 요소
  const container =
    text && !className ? (focusNode.parentElement as HTMLElement) : focusNode;

  return { container, curText: text, cursorPos: focusOffset };
};

export {
  createNewLine,
  moveup,
  movedown,
  moveLeft,
  moveRight,
  createNormalSpan,
  setCursorPosition,
  hasLink,
  getContainerElement,
};
