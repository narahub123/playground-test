import { validClass } from "../../data";
import { getCurElement } from "./text-editor";

const getFirstSelected = () => {
  let firstSelected;
  let position = 0;
  const { curElem } = getCurElement();
  if (!curElem) return { firstSelected: curElem, position };

  const content = curElem.parentElement?.parentElement;
  if (!content) return { firstSelected: curElem, position };

  const lines = [...content.children] as HTMLElement[];

  for (const line of lines) {
    const children = [...line.children] as HTMLElement[];
    position = 0;
    for (const child of children) {
      const classNames = child.className.match(validClass) as string[];

      if (classNames[2]) {
        firstSelected = child;

        break;
      }

      const text = child.textContent || "";

      const length = text.length;

      position += length;
    }
  }

  return { firstSelected, position };
};

// 현재 노드의 다음 텍스트 노드 또는 span 요소를 찾는 헬퍼 함수
const getNextTextNode = (currentNode: Node) => {
  let next = currentNode.nextSibling;

  let nextLine = currentNode.parentNode?.nextSibling;

  if (next) {
    while (next) {
      if (next.nodeType === Node.TEXT_NODE) {
        return { nextNode: next, start: 1 };
      }
      if (next.nodeType === Node.ELEMENT_NODE && next.textContent) {
        const classname = (next as HTMLElement).className;

        const start = classname.includes("link") ? 1 : 0;
        return { nextNode: next.firstChild, start };
      }
      next = next.nextSibling;
    }
  } else if (nextLine) {
    const nextLineFirst = nextLine.firstChild as Node;

    if (nextLineFirst.nodeType === Node.TEXT_NODE)
      return { nextNode: nextLineFirst, start: 0 };
    if (
      nextLineFirst.nodeType === Node.ELEMENT_NODE &&
      nextLineFirst.textContent
    )
      return { nextNode: nextLineFirst.firstChild, start: 0 };
  }

  return { nextNode: null, start: 0 }; // 다음 텍스트 노드가 없을 경우 null 반환
};

export { getFirstSelected, getNextTextNode };
