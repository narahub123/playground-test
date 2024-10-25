import { validClass, validHashtag, validMention, validURL } from "../../data";
import styles from "../../pages/TextEditor/TextEditor.module.css";
import { createGapSpan, createLinkClass, createNormalSpan } from "./create";

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

  // 이전 줄
  const prevLine = curLine?.previousElementSibling as HTMLElement;

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
      console.log(classNames);

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

export {
  setCursorPosition,
  hasLink,
  getCurElement,
  deleteByBackspace,
  checkValidLink,
  initializeSelection,
};
