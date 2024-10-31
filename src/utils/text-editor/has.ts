import { validClass, validHashtag, validMention, validURL } from "../../data";
import { createLink, createSpan } from "./create";
import { getCurElement } from "./get";
import { setCursorPosition } from "./set";

const hasLink = () => {
  const { curElem, curText, curClassName, endOffset } = getCurElement();
  if (!curElem) return;

  if (curClassName?.includes("link")) return;

  const link = validMention.test(curText)
    ? "mention"
    : validHashtag.test(curText)
    ? "hashtag"
    : validURL.test(curText)
    ? "url"
    : "";

  console.log("link 종류", link);

  // 정규 표현식
  const validation =
    link === "mention"
      ? validMention
      : link === "hashtag"
      ? validHashtag
      : link === "url"
      ? validURL
      : undefined;

  if (!validation) return;

  console.log("사용 중인 정규표현식", validation);

  // 유효한 문자열
  const matches = curText.match(validation);
  // link가 없다면 끝
  if (!matches) return;

  console.log("적합한 문자열", matches);

  // 마지막 인덱스 배열
  let lastIndexes = [];

  while (validation.exec(curText) !== null) {
    lastIndexes.push(validation.lastIndex);
  }

  // 다음 문자열
  const textAfter = curText.slice(lastIndexes[lastIndexes.length - 1]);
  console.log("다음 문자열", textAfter);

  if (textAfter) {
    const span = createSpan(textAfter);
    curElem.after(span);
  }

  // link
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];

    const span = createLink(match, link);
    curElem.after(span);

    // link 문자열이 2 이상 존재하고 첫 link가 아닌 경우
    if (matches.length > 1 && i !== 0) {
      const firstIndex = lastIndexes[i - 1];
      const lastIndex = lastIndexes[i] - match.length;

      // 문자열 사이의 문자열을 삽입한 span 생성
      const textBetween = curText.slice(firstIndex, lastIndex);
      console.log("사이 문자열", textBetween);

      const span = createSpan(textBetween);

      curElem.after(span);
    }
  }

  // 이전 문자열
  let firstIndex = validation.exec(curText)?.index;
  const textBefore = curText.slice(0, firstIndex);
  console.log("이전 문자열", textBefore);

  curElem.innerText = textBefore;

  setCursorPosition(curElem, endOffset);
};

const checkValidLink = () => {
  const { curElem, curText, curClassName, endOffset } = getCurElement();
  if (!curElem) return;

  // link 클래스가 아닌 경우 되돌아가기
  if (!curClassName?.includes("link")) return;
  const curClassNames = curClassName.match(validClass) as string[];
  const link = curClassNames[1]; // mentino, hashtag, url

  const validation =
    link === "mention"
      ? validMention
      : link === "hashtag"
      ? validHashtag
      : link === "url"
      ? validURL
      : undefined;
  if (!validation) return;

  const match = curText.match(validation);
  if (!match) return;
  console.log(match);

  const lastIndex = match[0].length;
  const textAfter = curText.slice(lastIndex);
  console.log("이후문자열", textAfter);

  const validText = curText.slice(0, lastIndex);

  curElem.innerText = validText;

  if (textAfter) {
    const span = createSpan(textAfter);
    console.log(span);

    curElem.after(span);

    setCursorPosition(span, isStartWithEmptyString(textAfter) ? 1 : 0);
    return;
  }

  setCursorPosition(curElem, endOffset);
};

const isStartWithEmptyString = (text: string) => {
  const valid = /^\s/;

  return valid.test(text);
};
export { hasLink, checkValidLink, isStartWithEmptyString };
