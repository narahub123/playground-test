import { validClass } from "../../data";
import { getCurElement } from "./text-editor";

const findFirstSelected = () => {
  const { curElem } = getCurElement();
  if (!curElem) return;

  let firstSelected;

  const content = curElem.parentElement?.parentElement;
  if (!content) return;
  const lines = [...content.children] as HTMLElement[];

  for (const line of lines) {
    const spans = [...line.children] as HTMLElement[];

    for (const span of spans) {
      const classname = (span.className.match(validClass) as string[])[2];

      if (classname) {
        firstSelected = span;

        break;
      }
    }
  }

  return firstSelected;
};

export { findFirstSelected };
