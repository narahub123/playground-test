import { validHashtag, validMention } from "../data";
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
  // #이 눌린 위치
  const anchorOffset = selection.anchorOffset;
  console.log("#이 눌린 위치", anchorOffset);

  // 현재 요소의 텍스트
  const text = focusNode.textContent || "";

  // # 이전 문자열
  const textBeforeSharp = text.slice(0, anchorOffset) || "";
  // # 이후 문자열
  const textAfterSharp = text.slice(anchorOffset) || "";

  // # 이전 문자열의 텍스트의 길이
  const length = textBeforeSharp.length;

  // # 이전 문자열의 마지막 문자
  const last = textBeforeSharp[length - 1];

  // 문자열을 감싸는 요소
  const container = text ? (focusNode.parentElement as HTMLElement) : focusNode;

  // 문자열을 감싸는 요소의 클래스 이름
  const curClassName = container.className;

  // 빈문자 열 정규 표현식
  const space = /\s/;

  console.log("이전에 공백문자 존재 여부", space.test(last));
  console.log("첫 문자인지 여부", !last);

  // 해시태그 클래스가 아니면서
  // 이전 문자열의 마지막에 공백이 있거나 이전 문자가 없는지 여부 확인
  if (
    (space.test(last) && !curClassName.includes("hashtag")) ||
    (!last && !curClassName.includes("hashtag"))
  ) {
    // 앞에 공백 문자가 있거나 문자의 가장 처음인 경우 해시 태그 클래스 생성
    // #이 문자열 중간에 들어온 경우 현재 요소에서 # 이후의 요소를 삭제하고
    // 새로운 클래스에 삭제된 문자열을 넣어줘야 함
    // # 이전 문자만 사용
    container.innerText = textBeforeSharp;

    // 만약 #이후의 문자열이 해새태그에 맞지 않는다면 맞는 부분까지만 잘라서 생성
    const next = textAfterSharp;

    // 해시태그 유효성을 충족하는 첫번째 문자열만 축출
    const validHashtag =
      next.match(/([가-힣ㄱ-ㅎㅏ-ㅣ\p{L}\p{N}_]+)/u)?.[0] || "";

    // 유효한 문자열을 제외한 남은 문자열
    let restText = textAfterSharp.replace(validHashtag, "");

    // 남은 문자열에서 첫 문자가 공백 문자면 삭제함
    const first = restText.slice(0, 1);

    restText = space.test(first) ? restText.slice(1) : restText;

    // 이후 문자열은 사이 span에 삽입
    createBetweenSpan(container, restText);

    // 해시태그 생성 : 유효한 문자열이 있는 경우
    createHashtag(container, validHashtag);

    // 해시태그 생성 조건에 맞지 않은 경우
    // 기존 문자열에 # 추가
    // 커서도 # 뒤로 이동함
  } else {
    // 새로운 클래스를 생성하지 않는 경우
    // 현재 문자열에 # 삽입
    container.innerText = textBeforeSharp + "#" + textAfterSharp;

    // 현재 클래스가 해시태그인 경우
    if (container.className.includes("hashtag")) {
      // 기존의 클래스 삭제
      container.removeAttribute("class");
      // 유효성 검사 이벤트 삭제
      container.removeEventListener("input", (e: Event) =>
        checkValidHashtag(e as InputEvent)
      );

      // 이전 요소
      const prevSibling = container.previousElementSibling;
      // 이전 요소의 문자열
      const prevText = prevSibling?.textContent || "";
      // 이전 요소의 문자열의 길이
      const prevLength = prevText.length;
      // 이전 이전 요소
      const prevPrevSibling = prevSibling?.previousElementSibling;
      // 다음 요소
      const nextSibling = container.nextElementSibling;

      // 이전 요소 존재 여부
      if (prevSibling) {
        // 이전 요소가 존재하는 경우
        const text = container.textContent || "";

        // 이전 요소의 텍스트를 합침
        const combinedText = prevText + text;

        // 합친 텍스트를 넣어줌
        container.innerText = combinedText;

        // 이전 요소를 삭제함
        prevSibling.remove();

        // 이전 이전 요소가 존재하는지 확인
        if (prevPrevSibling) {
          // 이전 이전 요소가 존재한다면 현재 요소는 between span
          container.setAttribute("class", `${styles.span} ${styles.between}`);
        } else {
          // 이전 이전 요소가 존재하지 않으면 현재 요소는 start span
          container.setAttribute("class", `${styles.span} ${styles.start}`);
        }
      } else {
        // 이전 요소가 존재하지 않는 경우
        container.setAttribute("class", `${styles.span} ${styles.start}`);
      }

      // 다음 요소가 존재하는지 여부 확인
      if (nextSibling) {
        // 뒤의 요소가 존재하는 경우
        const text = container.innerText;
        const nextText = " " + nextSibling.textContent || " ";

        // 현재 요소과 이후 요소의 텍스트를 합침
        const newText = text + nextText;
        // 새로운 텍스트를 넣어줌
        container.innerText = newText;

        // 다음 요소는 삭제함
        nextSibling.remove();
      }

      // 커서를 새로 추가된 # 다음에 위치시킴
      // 이전 문자열이 존재하는 경우 이전 문자열의 길이를 더해야 함
      setCursorPosition(container, prevLength + length + 1);

      return;
    }

    // 커서를 새로 추가된 # 다음에 위치시킴
    setCursorPosition(container, length + 1);
  }
};

// hashtag 클래스 생성하기
const createHashtag = (container: HTMLElement, textAfterSharp: string) => {
  const span = document.createElement("span");
  span.setAttribute("class", `${styles.link} ${styles.hashtag}`);
  span.setAttribute("contentEditable", "true");
  span.innerText = "#" + textAfterSharp;

  // onInput 이벤트 핸들러 추가
  span.addEventListener("input", (e: Event) =>
    checkValidHashtag(e as InputEvent)
  );

  container.after(span);
  setCursorPosition(span, 1);
};

// hashtag 유효성 확인하기
const checkValidHashtag = (e: InputEvent) => {
  e.preventDefault();
  const target = e.target as HTMLElement;

  // 해시 태그 클래스 안에서만 사용
  if (!target.className.includes("hashtag")) return;

  // 해시태그 안의 문자열
  const text = target.innerText;

  // 문자열의 유효성 검사
  const isValid = validHashtag.test(text);

  // 유효하지 않는 문자가 들어오면 사이 span 생성
  if (!isValid) {
    const validText =
      text.match(/^#([가-힣ㄱ-ㅎㅏ-ㅣ\p{L}\p{N}_]+)/u)?.[0] || "";
    let restText = text.replace(validText, "");

    // 남은 문자열에서 첫 문자가 공백 문자면 삭제함
    const first = restText.slice(0, 1);
    const space = /\s/;
    restText = space.test(first) ? restText.slice(1) : restText;
    // 마지막 문자를 가져 처음 문자로 삽입함
    createBetweenSpan(target, restText);

    target.innerText = validText;
  }
};

// 사이 span 생성하기
// string은 공백을 trim한 문자가 와야 하는 듯
const createBetweenSpan = (container: HTMLElement, startsWith: string = "") => {
  console.log(startsWith);

  const span = document.createElement("span");
  span.setAttribute("class", `${styles.span} ${styles.between}`);
  span.setAttribute("contentEditable", "true");

  // 제공된 텍스트를 삽입
  span.innerText = startsWith;

  // 제공된 텍스트의 첫문자만 추출
  const first = startsWith[0];

  // 유효성 검사 정규 표현식
  const valid = /([가-힣ㄱ-ㅎㅏ-ㅣ\p{L}\p{N}_]+)/u;

  // 만약 유효하다면 0 아니면 1
  // 유효한 경우 : 해시태그 안에서 스페이스를 누른 경우 왜냐면 공백문자는 삭제됨
  // 유효하지 않은 경우: 그 외 허용되지 않는 문자 삽입한 경우
  const point = valid.test(first) ? 0 : 1;

  container.after(span);
  setCursorPosition(span, point);
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

  container.innerText = text + "@";
  // 멘션 생성 가능 여부 확인하기

  setCursorPosition(container, container.innerText.length);
  // 멘션 클래스 생성하기
  // createMention(container);
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

// mention 클래스 생성
const createMention = (container: HTMLElement, text: string) => {
  const span = document.createElement("span");
  span.setAttribute("class", `${styles.link} ${styles.mention}`);
  span.setAttribute("contentEditable", "true");
  span.innerText = text;

  // onInput 이벤트 핸들러 추가
  span.addEventListener("input", (e: Event) => checkValidMention(e));

  container.after(span);

  return span;
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

// 현재 요소에 link 클래스에 적합한 것이 있는지 확인
const hasLink = (curElement: HTMLElement) => {
  hasMention();
};
// 현재 요소가 멘션을 가지고 있는지 확인
const hasMention = () => {
  const selection = window.getSelection();
  if (!selection) return;
  const focusNode = selection.focusNode as HTMLElement;
  if (!focusNode) return;

  const text = focusNode.textContent || "";

  const curElement = text
    ? (focusNode.parentElement as HTMLElement)
    : focusNode;

  console.log("현재요소", curElement);
  let cursorElement = curElement;
  let cursorText = "";

  // 현재 요소의 문자열
  const curText = curElement.textContent || "";
  console.log("현재 작성 중인 문자열", curText);

  // 적용되는 정규 표현식
  console.log("적용되는 정규 표현식", validMention);

  // 유효한 문자열이 있는지 확인
  const isValid = validMention.test(curText);

  console.log(
    "멘션이 있는지 확인",
    isValid ? "유효한 문자열 있음" : "유효한 문자열 없음"
  );

  // 유효한 문자열 존재 여부 확인
  if (isValid) {
    // 유효한 문자열

    const valid = curText.match(validMention) as RegExpMatchArray;

    console.log("유효한 문자열 배열", valid);

    // 첫번째 유효한 문자열의 index를 찾기 위해서 exec를 이용함
    const index = validMention.exec(curText)?.index;

    // 이전 문자열
    // mention 클래스 내에서는 존재 불가
    // 그 이외의 클래스에서는 존재할 수 있음
    // 이전 문자열이 존재하는 경우 이전 문자열은 기존 클래스에 추가해야 함
    // 이전 문자열

    const textBefore = curText.slice(0, index);

    console.log("이전 문자열", textBefore);
    // 이전 문자열은 기존 요소에 삽입
    curElement.innerText = textBefore;
    cursorText = textBefore;

    // mention 클래스 생성하기
    for (let i = valid.length - 1; i >= 0; i--) {
      const text = valid[i];
      console.log("유효한 문자열", text);
      const mention = createMention(curElement, text);

      // text가 가장 첫 문자열인 경우
      if (i === valid.length - 1) {
        // 다음 요소 확인
        const nextSpan = mention.nextElementSibling;
        if (nextSpan && nextSpan.className.includes("link")) {
          createGapSpan(mention, "");
        }
      }
      if (i === 0 && valid.length === 1) {
        // 유효한 문자열이 하나만 존재한는 경우
        cursorElement = mention;
        cursorText = text;
      }

      // 사이 문자열
      // 유효한 문자열이 2개 이상있을 때 그 사이의 문자열
      // 이전 유효성 이후에 와야 함 curElement를 이전 유효성 요소로 변경
      // 사이 문자열의 시작이 빈문자열인 경우 => gap span 생성
      // 사이 문자열의 시작이 빈문자열이 아닌 경우 => normal span 생성
      // 사이 문자열이 존재하는지 확인
      const textBetween =
        valid.length > 1 && i > 0
          ? curText.split(valid[i - 1])[1].split("@")[0]
          : "";
      console.log("사이 문자열", textBetween ? textBetween : "없음");

      if (textBetween) {
        if (checkSpace(textBetween)) {
          const trimmedTextBetween = textBetween.slice(1);
          // 공백이 있는 경우: gap span 생성
          const gap = createGapSpan(curElement, trimmedTextBetween);
          cursorElement = gap;
          cursorText = trimmedTextBetween;
        } else {
          // 공백이 없는 경우 : normal span 생성
          const normal = createNormalSpan(curElement, textBetween);
          cursorElement = normal;
          cursorText = textBetween;
        }
      }
    }

    setCursorPosition(cursorElement, cursorText.length);
  }

  // 유효한 문자열이 없다면 종료
  return;
};

// 멘션 클래스 내에서는 유효성 검사
const checkValidMention = (e: Event) => {
  const selection = window.getSelection();
  if (!selection) return;

  const focusNode = selection.focusNode as HTMLElement;
  if (!focusNode) return;
  const focusOffset = selection.focusOffset;
  console.log("멘션에서의 커서의 위치", focusOffset);

  const curText = focusNode.textContent || "";
  console.log("멘션 클래스 내의 문자열", curText);

  // 현재 요소
  const container = curText
    ? (focusNode.parentElement as HTMLElement)
    : focusNode;
  // 이전 요소
  const prevSibling = container.previousElementSibling as HTMLElement;
  const prevText = prevSibling?.textContent || "";

  // 이후 요소
  const nextSibling = container.nextElementSibling as HTMLElement;
  const nextText = nextSibling?.textContent || "";
  console.log("이후 요소의 문자열", nextText);

  const className = container.className;
  console.log(
    className.includes("mention") ? "멘션 클래스 내에 있음" : "멘션 클래스 아님"
  );

  // 멘션 클래스 내에서의 유효성 검사이기 때문에 멘션 클래스가 아닌 경우 적용 안됨
  if (!className.includes("mention")) return;

  // 멘션 클래스 내 유효성 충족하는 문자열의 배열
  const matchArr = curText.match(validMention);
  console.log("멘션 클래스 내 유효성 충족하는 문자열의 배열", matchArr);

  // 유효성을 충족하지 않는 부분
  const unmatched = curText.slice(matchArr?.[0].length);

  // 멘션 클래스 내에 유효성을 충족하는 문자열이 없는 경우
  if (!matchArr) {
    // 멘션 클래스 삭제
    container.removeAttribute("class");

    let combinedText = curText;
    // 이후 요소가 존재하고 span 클래스라면 병합
    if (nextSibling && nextSibling.className.includes("span")) {
      combinedText +=
        (nextSibling.className.includes("gap") ? " " : "") + nextText;

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
    }

    // 새로 추가된 문자열 때문에 문자가 생기는 것이라
    // 새로 추가된 문자열의 마지막 위치를 알아야 할 듯
    setCursorPosition(prevSibling, prevText.length + focusOffset);
    return;
  } else if (unmatched) {
    // 멘션 클래스 내에 유효성을 충족하는 문자열의 배열이 있는 경우
    // 유효성을 충족하는 부분은 그대로 남기로 충족하지 않는 부분만 span으로 넘김
    console.log("유효성을 충족하지 않는 부분", unmatched);

    // 문자열 공백 문자로 시작하면 제거하고 아니며 그대로
    let newText = checkSpace(unmatched) ? unmatched.slice(1) : unmatched;

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

      setCursorPosition(gap, 0);
    } else {
      // 공백문자로 시작하지 않는  경우 : normal 생성
      const normal = createNormalSpan(container, newText);

      setCursorPosition(normal, 1);
    }

    // 현재 요소에 유효성 적합한 문자열만 포함
    container.innerText = matchArr[0];
  }
};

// 공백 문자로 시작하는지 여부 확인
const checkSpace = (text: string) => {
  return /^\s/.test(text);
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
  createMention,
  isURL,
  createBetweenSpan,
  createNormalSpan,
  setCursorPosition,
  hasLink,
};
