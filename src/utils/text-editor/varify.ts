import { getCurElement } from "./text-editor";

// 현재 요소가 selected 클래스인지 여부 확인하기
const varifySelected = () => {
  let isSelected = false;

  const { curClassNames } = getCurElement();

  if (!curClassNames) return isSelected;

  if (curClassNames[2] && curClassNames[2] === "selected") {
    isSelected = true;
  }

  return isSelected;
};

export { varifySelected };
