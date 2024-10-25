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

export { getFirstSelected };
