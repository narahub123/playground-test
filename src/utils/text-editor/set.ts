// 커서의 위치를 지정하는 메서드
const setCursorPosition = (
  element: HTMLElement | Node | null,
  index: number
) => {
  if (!element) return;
  
  const range = document.createRange();

  range.setStart(
    element.childNodes[0] || element,
    Math.min(index, element.textContent?.length || 0)
  );

  // range의 경계 지점 중 하나로 영역을 붕괴 시킴
  range.collapse(true);

  const selection = window.getSelection();

  // selection 내의 모든 range 객체를 삭제함
  selection?.removeAllRanges();
  // selection에 range 객체를 추가함
  selection?.addRange(range);
};

export { setCursorPosition };
