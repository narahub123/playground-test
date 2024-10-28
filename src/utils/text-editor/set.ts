const setCursorPosition = (element: HTMLElement | Node, index: number) => {
  // range 객체 생성
  const range = document.createRange();

  // range 객체의 시작 위치 설정
  // range.setStart(startNode, startIndex)
  range.setStart(
    element.childNodes[0] || element,
    Math.min(index, element.textContent?.length || 0)
  );

  // range의 경계 지점 중 하나의 영역을 붕괴 시킴 (시작점과 종료점을 통합함)
  range.collapse(true);

  // selection 객체 불러오기
  const selection = window.getSelection();

  // selection 내의 모든 range 객체 삭제
  selection?.removeAllRanges();
  // selection 객체에 새로운 range 객체 추가
  selection?.addRange(range);
};

export { setCursorPosition };
