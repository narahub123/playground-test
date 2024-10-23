import { validClass, validHashtag, validMention, validURL } from "../data";
import styles from "../pages/TextEditor/TextEditor.module.css";

// 다음 줄 생성하기 
const createNewLine = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault(); // keydown 이벤트 전체에 적용하면 f5같은 기능이 먹히지 않음 주의할 것

  const { curElem, curText, curPosition, curLine, nextElem } = getCurElement();

  let newText = "";
  let addedElems: HTMLElement[] = [];

  // 현재 위치에 있을 문자열
  const remainedText = curText.slice(0, curPosition);

  curElem.innerText = remainedText;

  // 이동할 문자열
  newText = curText.slice(curPosition);

  // 다음 요소가 존재하는 경우
  if (nextElem) {
    // 현재 줄의 자식 요소들
    const childSpan = [...curLine.children] as HTMLElement[];

    // 현재 요소의 위치
    const indexOfCurElem = childSpan.indexOf(curElem);
    console.log("현재 요소의 위치", indexOfCurElem);
    // 이동 할 자식 요소들
    addedElems = childSpan.slice(indexOfCurElem + 1);
  }

  const div = document.createElement("div");
  div.setAttribute("class", styles.line);

  const span = document.createElement("span");
  span.setAttribute("class", `${styles.span} ${styles.normal}`);
  span.setAttribute("contentEditable", "true");

  div.appendChild(span);

  // 현재 선택된 요소의 다음에 새로운 라인 생성
  curLine?.after(div);

  for (let i = 0; i < addedElems.length; i++) {
    // 추가될 요소
    const addedElem = addedElems[i];

    // 첫번째 요소인 경우
    if (i === 0) {
      // 첫번째 요소가 span 클래스인 경우
      if (addedElem.className.includes("span")) {
        const text = addedElem?.textContent || "";
        newText += addedElem.className.includes("gap") ? " " : "" + text;

        addedElem.remove();
      }
    }

    console.log(addedElem);

    span.after(addedElem);
  }

  span.innerText = newText;
  setCursorPosition(span, 0);
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
  const { curElem, prevLine } = getCurElement();
  if (!curElem) return;

  console.log(prevLine);

  // 이전 줄이 존재하지 않으면 아무것도 하지 않음
  if (!prevLine) return;

  // 커서의 위치
  const x = getCursorPos();

  // 이동할 요소와 요소의 left 좌표
  const { elem, xPos } = getElementInLineByPosition(x, curElem, prevLine);

  // 이동할 요소 내에서 이동할 위치 찾기 => 반환 값은 index?
  const index = getPosition(elem, x - xPos);

  const moveTo = elem;
  const pos = index;

  setCursorPosition(moveTo, pos);
};

// ↓ 방향키 사용시
const movedown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();

  const { curElem, nextLine } = getCurElement();
  if (!curElem) return;

  // 다음 줄이 존재하지 않으면 아무것도 하지 않음
  if (!nextLine) return;

  // 커서의 위치
  const x = getCursorPos();

  // 이동할 요소와 요소의 left 좌표
  const { elem, xPos } = getElementInLineByPosition(x, curElem, nextLine);

  // 이동할 요소 내에서 이동할 위치 찾기 => 반환 값은 index?
  const index = getPosition(elem, x - xPos);

  setCursorPosition(elem, index);
};

// <- 방향키 사용시
const moveLeft = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();

  const { curElem, curPosition, prevElem, prevText, curClassName, prevLine } =
    getCurElement();
  if (!curElem) return;

  let cursorElement = curElem;
  let cursorPosition = curPosition;

  // 기준점
  const focalPoint = prevElem && curClassName.includes("link") ? 1 : 0;

  // 현재 커서의 위치가 기준점보다 큰 경우 : 하나 앞으로 이동
  if (curPosition > focalPoint) {
    cursorElement = curElem;
    cursorPosition = curPosition - 1;
  } else if (curPosition === focalPoint) {
    // 커서의 위치가 기준점과 같을 때
    // 이전 요소가 있는 경우
    if (prevElem) {
      cursorElement = prevElem;
      cursorPosition = prevText.length;
    } else {
      // 이전 요소가 없는 경우
      // 이전 줄이 있는 경우
      if (prevLine) {
        const prevLastChild = prevLine.lastChild as HTMLElement;
        const prevLastChildText = prevLastChild?.textContent || "";

        cursorElement = prevLastChild;
        cursorPosition = prevLastChildText.length;
      }

      // 이전 요소와 이전 줄이 없는 경우에는 아무런 이동도 일어나지 않음
    }
  }

  setCursorPosition(cursorElement, cursorPosition);
};

// → 방향키 사용시
const moveRight = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const { curElem, curText, curPosition, nextElem, nextClassName, nextLine } =
    getCurElement();
  if (!curElem) return;

  const length = curText?.length || 0;

  // 커서 위치
  let cursorElement = curElem;
  let cursorPosition = curPosition;

  // 현재 커서의 위치 현재 요소의 문자열 길이보다 작은 경우
  if (curPosition < length) {
    cursorPosition = curPosition + 1;
  }

  // 현재 위치가 현재 요소의 길이와 동일하다면 현재요소의 끝에 있다고 볼 수 있음
  if (curPosition === length) {
    // 이웃 요소가 존재하는 경우
    if (nextElem) {
      cursorElement = nextElem;
      // 클래스가 hashtag나 mention인 경우
      if (nextClassName.includes("link")) {
        cursorPosition = 1;
      } else {
        cursorPosition = 0;
      }

      // 이웃 요소가 존재하지 않는 경우
    } else {
      // 다음 줄이 있는 경우
      if (nextLine) {
        // 다음 줄 첫 번째 자식 요소
        const childSpan = nextLine.firstChild as HTMLElement;

        cursorElement = childSpan;
        cursorPosition = 0;
      }

      // 다음 요소가 없고 다음 줄도 없으면 아무런 이동이 일어나지 않음
    }
  }

  setCursorPosition(cursorElement, cursorPosition);
};

// backspace를 이용한 삭제
const deleteByBackspace = (e: React.KeyboardEvent<HTMLDivElement>) => {
  // backspace가 preventDefault가 되어 있더라도 process 인 경우에는
  // 삭제가 진행됨 주의
  const {
    curElem,
    curText,
    curPosition,
    curLine,
    curClassName,
    prevLine,
    prevElem,
    prevText,
  } = getCurElement();
  if (!curElem) return;

  let cursorElement = curElem;
  let cursorLength = curPosition;

  const lastPrevSpan = prevLine?.lastChild as HTMLElement;
  const lastPrevText = lastPrevSpan?.textContent || "";

  // 다음 요소들 배열
  const nextSpans = [...curLine.children] as HTMLElement[];

  // 현재 요소 내에서 위치가 0 인 경우
  if (curPosition === 0) {
    // 이전 요소가 있는 경우
    if (prevElem) {
      // span 앞에 link가 있는 경우만 생각하면됨
      const combinedText = prevText + curText;
      prevElem.innerText = combinedText;

      curElem.remove();

      cursorElement = prevElem;
      cursorLength = prevText.length;
    } else {
      // 이전 요소가 없는 경우
      // 이전 줄이 있는 경우
      if (prevLine) {
        // 다음 요소가 있는 경우
        for (let i = nextSpans.length - 1; i >= 0; i--) {
          const nextSpan = nextSpans[i];

          if (i === 0) {
            // 이전 요소 삭제 방지
            e.preventDefault();

            if (
              nextSpan.className.includes("span") &&
              lastPrevSpan.className.includes("span")
            ) {
              console.log("not you?");

              const newText = lastPrevText + curText;
              lastPrevSpan.innerText = newText;

              curElem.remove();

              // 커서 지정
              cursorElement = lastPrevSpan;
              cursorLength = lastPrevText.length;
            } else if (
              curClassName?.includes("link") &&
              lastPrevSpan.className.includes("link")
            ) {
              lastPrevSpan.after(curElem);
              const normal = createNormalSpan(lastPrevSpan, "");

              // 커서 지정
              cursorElement = normal;
              cursorLength = 0;
            } else {
              lastPrevSpan.after(curElem);
            }
          } else {
            lastPrevSpan.after(nextSpan);
          }
        }

        curLine.remove();
      }
      // 이전 라인이 없는 경우는 첫 줄인 경우인데 이 경우에는 앞에 요소가 있는 경우만 생각함
    }
  }

  // backspace가 누르면 가장 나중 문자를 삭제함(삭제 구현)
  // container.innerText = curText.slice(0, curText.length - 1 || 0);
  // 커서가 앞으로 움직이는 문제 해결 => 커서가 /삭제시에는 마지막 존재하도록 함
  setCursorPosition(cursorElement, cursorLength);
};

// 커서 위치 찾기
const getCursorPos = () => {
  const selection = window.getSelection();
  if (!selection) return 0;

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

// 요소 내 위치 찾기
const getPosition = (elem: HTMLElement, pos: number) => {
  let index = 0;
  console.log(elem);

  // 요소 내 문자열
  const text = elem?.textContent || "";

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

// ---------------------------------------------------------
// 현재 요소에 link 클래스에 적합한 것이 있는지 확인
const hasLink = () => {
  const validLink = isLink();

  if (validLink) {
    const { curElem, curText, curPosition, nextElem, nextClassName, nextText } =
      getCurElement();

    if (!curElem) return;

    // 커서 위치 지정을 위한 변수들
    let cursorElement = curElem;
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

    // 이후 문자열이 있는 경우
    if (textAfter) {
      let nextContainer: HTMLElement;
      // 공백 문자로 시작하는 경우
      if (checkSpace(textAfter)) {
        nextContainer = createGapSpan(curElem, textAfter.slice(1));
      } else {
        // 공백 문자로 시작하지 않는 경우
        nextContainer = createNormalSpan(curElem, textAfter);
      }

      // 이후 문자열을 감싸는 요소 다음에 span 클래스가 존재하는지 확인
      if (nextElem && nextClassName.includes("span")) {
        nextContainer.innerText =
          textAfter + nextClassName.includes("gap") ? " " : "" + nextText;

        nextElem.remove();
      }
    }

    // mention 클래스 생성하기
    for (let i = valid.length - 1; i >= 0; i--) {
      const text = valid[i];
      console.log("유효한 문자열", text);

      const link = createLinkClass(curElem, text, validLink);

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
          const gap = createGapSpan(curElem, textBetween.slice(1));
          cursorElement = gap;
          cursorText = textBetween.slice(1);
        } else {
          // 공백이 없는 경우 : normal span 생성
          const normal = createNormalSpan(curElem, textBetween);
          cursorElement = normal;
          cursorText = textBetween;
        }
      }
    }

    // 이전 문자열
    const index = validation.exec(curText)?.index;
    const textBefore = curText.slice(0, index);

    // 이전 문자열은 기존 요소에 삽입
    curElem.innerText = textBefore;

    if (textBefore && textBefore.length >= curPosition) {
      // 요소 지정
      cursorElement = curElem;
      // 커서 위치 지정
      cursorText = textBefore;
    } else if (!textBefore) {
      // 이전 문자열이 없는 경우
      const prevSibling = curElem.previousElementSibling;
      // 이전 요소가 없는 경우
      if (!prevSibling) {
        // 해당 요소 삭제
        curElem.remove();
      }
    }

    setCursorPosition(cursorElement, cursorText.length);
  }
};

const isLink = () => {
  const { curElem, curText } = getCurElement();
  if (!curElem) return "";

  const hashtag = validHashtag.test(curText);

  console.log(`유효한 hashtag 존재 ${hashtag ? "함" : "안함"}`);

  // 유효한 문자열이 있는지 확인
  const mention = validMention.test(curText);

  console.log(`유효한 mention 존재 ${mention ? "함" : "안함"}`);

  const url = validURL.test(curText);

  console.log(`유효한 url 존재 ${url ? "함" : "안함"}`);

  console.log(
    "적용되는 정규 표현식",
    hashtag ? validHashtag : mention ? validMention : validURL
  );

  const isValid = hashtag ? "hashtag" : mention ? "mention" : url ? "url" : "";

  return isValid;
};

const checkValidLink = () => {
  const {
    curElem,
    curText,
    curClassName,
    curPosition,
    prevElem,
    prevClassName,
    prevText,
    nextElem,
    nextText,
    nextClassName,
  } = getCurElement();
  if (!curElem) return;

  // 링크 클래스 내에서의 유효성 검사이기 때문에 링크 클래스가 아닌 경우 적용 안됨
  if (!curClassName.includes("link")) return;

  let cursorElement = curElem;
  let cursorLength = curText.length;

  const validation = curClassName.includes("mention")
    ? validMention
    : curClassName.includes("hashtag")
    ? validHashtag
    : curClassName.includes("url")
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
    curElem.removeAttribute("class");

    let combinedText = curText;
    console.log(combinedText);

    // 이후 요소가 존재하고 span 클래스라면 병합
    if (nextElem && nextClassName.includes("span")) {
      combinedText =
        curText + (nextClassName.includes("gap") ? " " : "") + nextText;

      nextElem.remove();
    }

    // 이전 요소가 있고 span 클래스라면 병합
    if (prevElem && prevClassName.includes("span")) {
      // 이전 요소의 텍스트와 현재 텍스트와 병합
      combinedText = prevText + combinedText;
      // 합친 텍스트를 이전 요소에 삽입
      prevElem.innerText = combinedText;

      // 현재 클래스 삭제
      curElem.remove();
      cursorElement = prevElem;
      cursorLength = combinedText.length + curPosition;
    } else if (!prevElem) {
      curElem.innerText = combinedText;

      curElem.setAttribute("class", `${styles.span} ${styles.normal}`);
      cursorElement = curElem;
      cursorLength = curPosition;
    }
  } else if (unmatched) {
    // 멘션 클래스 내에 유효성을 충족하는 문자열의 배열이 있는 경우
    // 유효성을 충족하는 부분은 그대로 남기로 충족하지 않는 부분만 span으로 넘김
    console.log("유효성을 충족하지 않는 부분", unmatched);

    // 문자열 공백 문자로 시작하면 제거하고 아니며 그대로
    let newText = checkSpace(unmatched) ? unmatched.slice(1) : unmatched;
    console.log(newText);

    // 이후 요소가 존재하고 이후 요소가 span 클래스인 지 확인
    if (nextElem && nextClassName.includes("span")) {
      // 유효성을 충족하지 않은 문자열과 다음 요소의 문자열을 병합
      newText += (nextClassName.includes("gap") ? " " : "") + nextText;

      // 이후 요소 삭제
      nextElem.remove();
    }

    // 유효성을 충족하지 않는 문자열이 공백문자로 시작하는지 확인
    if (checkSpace(unmatched)) {
      // 공백문자로 시작하는 경우 : gap span 생성
      const gap = createGapSpan(curElem, newText);

      cursorElement = gap;
      cursorLength = 0;
    } else {
      // 공백문자로 시작하지 않는  경우 : normal 생성
      const normal = createNormalSpan(curElem, newText);

      cursorElement = normal;
      cursorLength = 1;
    }

    // 현재 요소에 유효성 적합한 문자열만 포함
    curElem.innerText = matchArr[0];
  }

  setCursorPosition(cursorElement, cursorLength);
};

// -----------------------------------------------------------

// 공백 문자로 시작하는지 여부 확인
const checkSpace = (text: string) => {
  return /^\s/.test(text);
};

// 문자열 감싸고 있는 요소 찾기
const getCurElement = () => {
  const selection = window.getSelection();

  // 현재 요소
  const focusNode = selection?.focusNode as HTMLElement;

  const curPosition = selection?.focusOffset || 0;

  const text = focusNode.textContent || "";

  // 현재 요소의 클래스 이름
  const classname = focusNode.className;

  // 현재 요소를 감싸는 요소
  const curElem =
    text && !classname ? (focusNode.parentElement as HTMLElement) : focusNode;

  // 현재 요소 내의 문자열
  const curText = focusNode.textContent || "";

  // 현재 요소의 클래스 이름
  const curClassName = curElem.className;

  // 현재요소의 클래스 이름 배열
  const curClassNames = curClassName?.match(validClass) as string[];

  // 이전 요소
  const prevElem = curElem.previousElementSibling as HTMLElement;

  // 이전 요소의 문자열
  const prevText = prevElem?.textContent || "";

  // 이전 요소의 클래스 이름
  const prevClassName = prevElem?.className;

  // 이전 요소의 클래스 이름 배열
  const prevClassNames = prevClassName?.match(validClass) as string[];

  // 다음 요소
  const nextElem = curElem.nextElementSibling as HTMLElement;

  // 다음 요소의 문자열
  const nextText = nextElem?.textContent || "";

  // 다음 요소의 클래스 이름
  const nextClassName = nextElem?.className;

  // 다음 요소의 클래스 이름
  const nextClassNames = nextClassName?.match(validClass) as string[];

  // 현재 요소가 포함된 줄
  const curLine = curElem.parentElement as HTMLElement;

  console.log(curLine);

  // 이전 줄
  const prevLine = curLine?.previousElementSibling as HTMLElement;
  console.log(prevLine);

  // 다음 줄
  const nextLine = curLine?.nextElementSibling as HTMLElement;

  return {
    curElem,
    curText,
    curPosition,
    curClassName,
    curClassNames,
    prevElem,
    prevText,
    prevClassName,
    prevClassNames,
    nextElem,
    nextText,
    nextClassName,
    nextClassNames,
    curLine,
    prevLine,
    nextLine,
  };
};

/// ------------------------------------------------------
// Home 키
const moveStart = (e: React.KeyboardEvent<HTMLDivElement>) => {
  const { curElem, curLine } = getCurElement();
  if (!curElem) return;

  const firstChild = curLine?.firstChild as HTMLElement;

  setCursorPosition(firstChild, 0);
};

// End 키
const moveEnd = (e: React.KeyboardEvent<HTMLDivElement>) => {
  const { curElem, curLine } = getCurElement();
  if (!curElem) return;

  const lastChild = curLine?.lastChild as HTMLElement;
  const text = lastChild?.textContent || "";

  setCursorPosition(lastChild, text.length);
};

// PgUp 키
const movePageUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
  const { curElem } = getCurElement();
  if (!curElem) return;

  const content = curElem.parentElement?.parentElement;
  if (!content) return;

  const firstLine = content.firstChild as HTMLElement;

  const point = getCursorPos();

  // 이동할 요소와 요소의 left 좌표
  const { elem, xPos } = getElementInLineByPosition(point, curElem, firstLine);

  // 이동할 요소 내에서 이동할 위치 찾기 => 반환 값은 index?
  const index = getPosition(elem, point - xPos);

  setCursorPosition(elem, index);
};

// PgDn 키
const movePageDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  const { curElem } = getCurElement();
  if (!curElem) return;

  const content = curElem?.parentElement?.parentElement;
  if (!content) return;

  const lastChild = content.lastChild as HTMLElement;

  const point = getCursorPos();

  // 이동할 요소와 요소의 left 좌표
  const { elem, xPos } = getElementInLineByPosition(point, curElem, lastChild);

  // 이동할 요소 내에서 이동할 위치 찾기 => 반환 값은 index?
  const index = getPosition(elem, point - xPos);

  setCursorPosition(elem, index);
};

// 위치로 요소 찾기
const getElementInLineByPosition = (
  x: number,
  curElem: HTMLElement,
  targetLine: HTMLElement
) => {
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

  const children = targetLine.children;

  // 자식 요소들의 left의 합
  xPos = 0;

  let i = 0;
  let chosen = 0;

  // 자식 요소들의 left의 좌표가 커서의 위치보다 클 때까지
  while (xPos <= x && children[i]) {
    const child = children[i];

    const left = child.getBoundingClientRect().left;

    if (left > x) {
      chosen = i - 1;
      xPos = children[i - 1].getBoundingClientRect().left;
      break;
    } else if (i === children.length - 1) {
      chosen = i;
      xPos = left;
      break;
    }

    xPos = left;
    i++;
  }

  elem = children[chosen];

  return { elem: elem as HTMLElement, xPos };
};

// --------------------------------------------------------------------------
// selection

// 선택 초기화 하기
const initializeSelection = (
  setStart: (value: number) => void,
  setSelectedText: (value: string) => void,
  contentRef: React.RefObject<HTMLDivElement>
) => {
  // 커서 위치 불러오기
  const { curElem, curPosition } = getCurElement();
  if (!curElem) return;

  const classNames = curElem.className.match(validClass) as string[];

  const prevContainer = curElem.previousElementSibling as HTMLElement;
  const prevText = prevContainer?.textContent || "";
  const prevClassNames = prevContainer?.className.match(validClass) as string[];

  const prevPrevContainer =
    prevContainer?.previousElementSibling as HTMLElement;
  const prevPrevText = prevPrevContainer?.textContent || "";
  const prevPrevClassNames = prevPrevContainer?.className.match(
    validClass
  ) as string[];

  // 커서 지정
  const cursorElement =
    prevPrevContainer &&
    classNames[1] === prevClassNames[1] &&
    prevClassNames[1] === prevPrevClassNames[1]
      ? prevPrevContainer
      : prevContainer && classNames[1] === prevClassNames[1]
      ? prevContainer
      : curElem;

  const cursorPosition =
    prevPrevContainer &&
    classNames[1] === prevClassNames[1] &&
    prevClassNames[1] === prevPrevClassNames[1]
      ? (prevPrevText + prevText).length + curPosition
      : prevContainer && classNames[1] === prevClassNames[1]
      ? prevText.length + curPosition
      : curPosition;

  // selected 클래스를 없앰
  const content = contentRef.current;
  if (!content) return;

  // 컨텐트 내의 줄 배열
  const lines = [...content?.children] as HTMLElement[];

  for (let i = 0; i < lines.length; i++) {
    // 줄 요소
    const line = lines[i];

    // 줄 안의 span 배열
    const spans = [...line.children] as HTMLElement[];

    for (let j = 0; j < spans.length; j++) {
      // span 요소
      const span = spans[j];

      const className = span.className;

      const classNames = className.match(validClass) as string[];

      // select를 제외한 클래스만 남김
      span.setAttribute(
        "class",
        `${styles[classNames[0]]} ${styles[classNames[1]]}`
      );

      const prevSpan = span.previousElementSibling as HTMLElement;
      const prevClassNames = prevSpan?.className.match(validClass) as string[];

      // 이전 클래스가 있고 이전 클래스와 현재 클래스가 같다면 합침
      if (prevSpan) {
        // link 클래스에 2 번째 클래스도 동일한 경우
        if (classNames[0] === "link" && classNames[1] === prevClassNames[1]) {
          const prevText = prevSpan.textContent || "";
          const curText = span.textContent || "";

          const combinedText = prevText + curText;

          prevSpan.innerText = combinedText;

          span.remove();

          console.log("span의 className", className);
          console.log("현재 요소의 className", curElem.className);

          if (className === curElem.className) {
          }
        } else if (
          // 둘 다 span 클래스인 경우
          classNames[0] === "span" &&
          classNames[0] === prevClassNames[0]
        ) {
          const prevText = prevSpan.textContent || "";
          const curText = span.textContent || "";

          const combinedText = prevText + curText;

          prevSpan.innerText = combinedText;

          span.remove();

          // 통합된 문자열이 빈문자열로 시작하는 경우
          // 이전 클래스가 gap이 아닌 경우 : gap이 normal 클래스로 변환된 경우
          // 이전 이전 클래스가 있는 경우 : 이전 이전 클래스가 없으면 빈문자열로 시작해도 gap이 아님
          const prevPrevSpan = prevSpan.previousElementSibling;
          if (
            combinedText.startsWith(" ") &&
            prevClassNames[1] !== "gap" &&
            prevPrevSpan
          ) {
            // 이전 클래스를 gap으로 변경
            prevSpan.setAttribute("class", `${styles.span} ${styles.gap}`);
            // 빈문자열을 삭제한 문자열을 넣어줌
            prevSpan.innerText = combinedText.slice(1);
          }

          console.log("span의 className", className);
          console.log("현재 요소의 className", curElem.className);
        }
      }
    }
  }

  if (curPosition) {
    // 커서 위치에 대한 정보가 있는 경우
    // 해당 커서 위치를 시작 위치로 지정
    setStart(cursorPosition);
  } else {
    // 커서 위치에 대한 정보가 없는 경우
    // 우선 0으로 지정
    setStart(0);
  }

  // 저장된 텍스트를 빈문자열로 초기화
  setSelectedText("");

  // 커서 지정
  setCursorPosition(cursorElement, cursorPosition);
};

// shift + End로 현재 줄 마지막까지 선택하기
const selectToEnd = () => {
  const { curElem, curText, curPosition, curLine } = getCurElement();
  if (!curElem) return;

  // 현재 요소에서 선택되지 않은 요소
  const unselectedText = curText.slice(0, curPosition);
  // 현재 요소에 삽입
  curElem.innerText = unselectedText;

  // 선택된 현재 문자열
  const selectedText = curText.slice(curPosition);

  // 현재 요소와 동일한 클래스를 가지고 있는 선택 span 생성
  const selectedSpan = createSelectedSpan(curElem, selectedText);

  // 선택 span 현재 요소의 자식요소로 추가
  curElem.appendChild(selectedSpan);

  // 현재 줄의 자식 요소 배열
  const children = [...curLine?.children] as HTMLElement[];

  // 현재 요소의 index 알아내기
  const index = children.indexOf(curElem);
  console.log("현재 요소의 위치", index);

  // 현재 요소를 이후의 자식 요소
  const selectedChildren = children.slice(index + 1);

  // 선택된 자식 요소에 selected 클래스 삽입하기
  for (const child of selectedChildren) {
    const className = child.getAttribute("class");

    const classNames = className?.match(validClass) as string[];

    // 기존 클래스에 selected 클래스 추가하기
    child.setAttribute(
      "class",
      `${styles[classNames[0]]} ${styles[classNames[1]]} ${styles.selected}`
    );
  }

  // 현재 줄의 마지막 자식 요소 및 해당 요소의 길이 알아내기(커서 위치 지정)
  const lastChild = curLine?.lastChild as HTMLElement;
  const lastText = lastChild?.textContent || "";

  setCursorPosition(lastChild, lastText.length);
};

// shift + Home으로 현재 줄 시작까지 선택하기
const selectToStart = () => {
  const { curElem, curText, curPosition } = getCurElement();
  if (!curElem) return;

  const line = curElem.parentElement;
  if (!line) return;

  // 현재 요소에서 선택되지 않은 요소
  const unselectedText = curText.slice(curPosition);
  // 현재 요소에 삽입
  curElem.innerText = unselectedText;

  // 선택된 현재 문자열
  const selectedText = curText.slice(0, curPosition);

  // 현재 요소와 동일한 클래스를 가지고 있는 선택 span 생성
  const selectedSpan = createSelectedSpan(curElem, selectedText);

  // 선택 span 현재 요소의 자식요소로 추가
  curElem.prepend(selectedSpan);

  // 현재 줄의 자식 요소 배열
  const children = [...line.children] as HTMLElement[];

  // 현재 요소의 index 알아내기
  const index = children.indexOf(curElem);

  // 현재 요소를 이후의 자식 요소
  const selectedChildren = children.slice(0, index);

  // 선택된 자식 요소에 selected 클래스 삽입하기
  for (const child of selectedChildren) {
    const className = child.getAttribute("class");

    const classNames = className?.match(validClass) as string[];

    // 기존 클래스에 selected 클래스 추가하기
    child.setAttribute(
      "class",
      `${styles[classNames[0]]} ${styles[classNames[1]]} ${styles.selected}`
    );
  }

  // 현재 줄의 마지막 자식 요소 및 해당 요소의 길이 알아내기(커서 위치 지정)
  const firstChild = line.lastChild as HTMLElement;

  setCursorPosition(firstChild, 0);
};

// shift + PgUp으로 문장 첫 번째 줄 현재 위치까지 선택하기
const selectWithPgUp = () => {
  const { curElem, curLine } = getCurElement();
  if (!curElem) return;

  // 에디터
  const content = curElem?.parentElement?.parentElement as HTMLElement;
  if (!content) return;

  // 에디터 내의 모든 줄
  const lines = [...content.children] as HTMLElement[];

  // 현재 줄의 위치
  const indexOfline = lines.indexOf(curLine);

  // 현 줄 이전의 줄 배열 -현재 첫째줄
  const selectedLines = lines.slice(1, indexOfline);

  // 선택된 줄들에 selected 클래스 추가하기
  for (const line of selectedLines) {
    // 줄 안의 모든 요소들
    const children = line.children;
    for (const child of children) {
      const classname = child.getAttribute("class");
      if (!classname) return;
      const classnames = classname.match(validClass) as string[];

      child.setAttribute(
        "class",
        `${styles[classnames[0]]} ${styles[classnames[1]]} ${styles.selected}`
      );
    }
  }

  // 마지막 줄
  const firstLine = content.firstChild as HTMLElement;
  const firstChildren = [...firstLine.children] as HTMLElement[];

  const selection = getSelection();
  if (!selection) return;

  // 커서의 위치
  const x = getCursorPos();
  console.log("커서 위치", x);

  // 이동할 요소와 요소의 left 좌표
  const { elem, xPos } = getElementInLineByPosition(x, curElem, firstLine);
  console.log(elem, xPos);

  // 이동할 요소 내에서 이동할 위치 찾기 => 반환 값은 index?
  const index = getPosition(elem, x - xPos);
  console.log("문자열 내의 위치", index);

  const indexOfSpan = firstChildren.indexOf(elem);

  // 이 후 span 모두 selected 클래스로 변경
  const nextSpans = firstChildren.slice(indexOfSpan + 1);

  for (const span of nextSpans) {
    const classname = span.getAttribute("class");
    if (!classname) return;
    const classnames = classname?.match(validClass) as string[];

    span.setAttribute(
      "class",
      `${styles[classnames[0]]} ${styles[classnames[1]]} ${styles.selected}`
    );
  }

  // 위치가 일치하는 span 중 index까지 변환
  // 위치가 일치하는 요소의 text
  const elemText = elem.textContent || "";
  const selectedText = elemText.slice(index);
  console.log("선택된 문자열", selectedText);

  const unselectedText = elemText.slice(0, index);
  console.log("선택 안 된 문자열", selectedText);
  elem.innerText = unselectedText;

  const selectedSpan = createSelectedSpan(elem, selectedText);
  elem.appendChild(selectedSpan);

  selectToStart();
};

// shift + PgDn으로 문장 마지막 줄 현재 위치까지 선택하기
const selectWithPgDn = () => {
  const { curElem, curLine } = getCurElement();
  if (!curElem) return;

  // 에디터
  const content = curElem?.parentElement?.parentElement as HTMLElement;
  if (!content) return;

  // 에디터 내의 모든 줄
  const lines = [...content.children] as HTMLElement[];

  // 현재 줄의 위치
  const indexOfline = lines.indexOf(curLine);

  // 현 줄 이후의 줄 배열 - 마지막 줄
  const selectedLines = lines.slice(indexOfline + 1, lines.length - 1);

  // 선택된 줄들에 selected 클래스 추가하기
  for (const line of selectedLines) {
    // 줄 안의 모든 요소들
    const children = line.children;
    for (const child of children) {
      const classname = child.getAttribute("class");
      if (!classname) return;
      const classnames = classname.match(validClass) as string[];

      child.setAttribute(
        "class",
        `${styles[classnames[0]]} ${styles[classnames[1]]} ${styles.selected}`
      );
    }
  }

  // 마지막 줄
  const lastLine = content.lastChild as HTMLElement;
  const lastChildren = [...lastLine.children] as HTMLElement[];

  const selection = getSelection();
  if (!selection) return;

  // 커서의 위치
  const x = getCursorPos();

  // 이동할 요소와 요소의 left 좌표
  const { elem, xPos } = getElementInLineByPosition(x, curElem, lastLine);

  // 이동할 요소 내에서 이동할 위치 찾기 => 반환 값은 index?
  const index = getPosition(elem, x - xPos);
  const indexOfSpan = lastChildren.indexOf(elem);

  // 이전 span 모두 selected 클래스로 변경
  const prevSpans = lastChildren.slice(0, indexOfSpan);

  for (const span of prevSpans) {
    const classname = span.getAttribute("class");
    if (!classname) return;
    const classnames = classname?.match(validClass) as string[];

    span.setAttribute(
      "class",
      `${styles[classnames[0]]} ${styles[classnames[1]]} ${styles.selected}`
    );
  }

  // 위치가 일치하는 span 중 index까지 변환
  // 위치가 일치하는 요소의 text
  const elemText = elem.textContent || "";
  const selectedText = elemText.slice(0, index);
  const unselectedText = elemText.slice(index);
  elem.innerText = unselectedText;

  const selectedSpan = createSelectedSpan(elem, selectedText);
  elem.prepend(selectedSpan);

  // 첫 줄 커서 부터 마지막 까지 선택
  selectToEnd();
};

const selectWithArrowRight = (
  e: React.KeyboardEvent<HTMLDivElement>,
  start: number,
  setStart: (value: number) => void,
  selectedText: string,
  setSelectedText: (value: string) => void
) => {
  e.preventDefault();

  const {
    curElem,
    curText,
    curClassNames,
    nextElem,
    nextText,
    nextClassNames,
    nextLine,
  } = getCurElement();
  if (!curElem) return;

  // 현재 위치
  let index = start;
  console.log("현재 커서 위치", index);

  // 현재 요소
  let curElement = curElem;

  // 현재 요소의 문자열
  let selectedTexts = selectedText;

  const nextFirst = nextLine?.firstChild as HTMLElement;

  // 현재 요소가 selected가 아닌 경우
  if (!curClassNames.includes("selected")) {
    // 선택안된 문자열은 현재 요소에 삽입
    const unselectedBefore = curText.slice(0, index);
    console.log("선택 전 문자열", unselectedBefore);

    const unselectedAfter = curText.slice(index + 1);
    console.log("선택 후 문자열", unselectedAfter);

    if (unselectedAfter) {
      const span = document.createElement("span");
      span.setAttribute(
        "class",
        `${styles[curClassNames[0]]} ${styles[curClassNames[1]]}`
      );
      span.setAttribute("contentEditable", "true");
      span.innerText = unselectedAfter;

      curElement.after(span);
    }

    // 선택된 문자열 현재 문자열 옆에 selected span으로 삽입
    const selected = curText.slice(index, index + 1);
    console.log("선택된 문자열", selected);

    const selectedSpan = createSelectedSpan(curElem, selected);

    curElement.after(selectedSpan);

    curElement = selectedSpan;
    selectedTexts = selected;

    index = 1;

    setStart(index);
    setSelectedText(selectedTexts);

    if (unselectedBefore) {
      curElem.innerText = unselectedBefore;
    } else {
      curElem.remove();
    }
  } else {
    // 현재 요소가 selected 인 경우
    // 다음 요소가 있는 경우
    if (nextElem) {
      // 현재 요소와 다음 요소가 같은 클래스 인 경우 병합
      // 혹은 현재 요소 다음 요소 모두 span 클래스인 경우
      if (
        (curClassNames[0] === nextClassNames[0] &&
          curClassNames[1] === nextClassNames[1]) ||
        (curClassNames[0] === "span" && nextClassNames[0] === "span")
      ) {
        // 첫 문자를 선택 문자열에 추가
        selectedTexts += nextText.slice(0, 1);

        // 선택 문자열을 현재 요소에 삽입
        curElement.innerText = selectedTexts;
        // 선택 문자열 업데이트
        setSelectedText(selectedTexts);

        // 위치를 선택 문자열의 길이로 업데이트
        index = selectedTexts.length;

        // 남은 문자열 추출
        const remainedText = nextText.slice(1);

        // 남은 문자열이 있다면
        if (remainedText) {
          // 다음 문자열에 남은 문자열 삽입
          nextElem.innerText = nextText.slice(1);
        } else {
          // 다음 문자열이 없다면 다음 요소 삭제
          nextElem.remove();
        }
      } else {
        // 현재 요소와 다음 요소의 클래스가 다른 경우
        const addedText =
          (nextClassNames[1] === "gap" ? " " : "") + nextText.slice(0, 1);

        // 다음 요소와 동일한 클래스의 selected Span 생성
        const selectedSpan = createSelectedSpan(nextElem, addedText);

        curElement.after(selectedSpan);

        setSelectedText(addedText);

        const remainedText = nextText.slice(1);

        if (nextClassNames[1] === "gap") {
          nextElem.setAttribute("class", `${styles.span} ${styles.normal}`);
        }
        if (remainedText) {
          nextElem.innerText = remainedText;
        } else {
          nextElem.remove();
        }

        curElement = selectedSpan;
        index = addedText.length;
      }
    } else {
      // 다음 요소가 없는 경우
      // 다음 줄이 있는 경우
      if (nextLine) {
        curElement = nextFirst;
        index = 0;
      }
    }
  }

  setCursorPosition(curElement, index);
};

const selectWithArrowLeft = () => {};
const selectWithArrowUp = () => {};
const selectWithArrowDown = () => {};

// selected span 생성하기
const createSelectedSpan = (container: HTMLElement, text: string) => {
  const span = document.createElement("span");

  const classname = container.getAttribute("class");
  const classNames = (classname?.match(validClass) as string[]).map((c) => {
    if (c === "gap") return "normal";
    else return c;
  });

  console.log(classNames);

  span.setAttribute(
    "class",
    `${styles[classNames[0]]} ${styles[classNames[1]]} ${styles.selected}`
  );
  span.setAttribute("contentEditable", "true");
  span.innerText = text;

  return span;
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
  getCurElement,
  deleteByBackspace,
  checkValidLink,
  moveStart,
  moveEnd,
  movePageUp,
  movePageDown,
  selectToEnd,
  selectToStart,
  selectWithPgUp,
  selectWithPgDn,
  selectWithArrowRight,
  selectWithArrowLeft,
  selectWithArrowUp,
  selectWithArrowDown,
  initializeSelection,
};
