import { setCursorPosition } from "./set";

const moveRight = (e: React.KeyboardEvent<HTMLDivElement>) => {
  e.preventDefault();

  const selection = getSelection();
  if (!selection) return;
  // 현재 요소
  const currentNode = selection.focusNode;
  if (!currentNode) return;
  // 현재 요소 내 커서 위치
  const currentPosition = selection.focusOffset;
  console.log("현재 요소", currentNode);
  console.log("현재 요소", currentPosition);

  // 현재 요소 내의 문자열
  const currentText = currentNode?.textContent || "";
  console.log("현재 요소 내의 문자열", currentText);

  let cursorElement = currentNode;
  let cursorPosition = currentPosition;

  // 현재 container: 현재 요소 내에 문자열이 있는 경우와 없는 경우를 구분해야 함
  const curContainer = currentText
    ? currentNode?.parentElement?.parentElement
    : currentNode?.parentElement;
  console.log("현재 컨테이너", curContainer);
  const curLine = curContainer?.parentElement;
  if (!curLine) return;

  // 현재 위치가 현재 요소 내의 문자열의 길이와 일치하는 경우
  if (currentPosition === currentText.length) {
    console.log("현재 요소 내의 문자열의 길이와 현재 위치가 일치함");
    // 다음 컨테이너가 있는지 확인하고 있다면 이동
    // 다음 컨테이너
    const nextContainer = curContainer?.nextElementSibling;

    if (nextContainer) {
      // 다음 컨테이너가 있는 경우
      console.log("다음 요소 있음");
      // 다음 컨테이너의 자식요소가 link 클래스인 경우 1로 이동 아니면 0으로 이동
      cursorElement = nextContainer.firstChild as HTMLElement;
      cursorPosition = (
        nextContainer.firstChild as HTMLElement
      ).className.includes("link")
        ? 1
        : 0;
    } else {
      console.log("다음 요소 없음");
      // 다음 줄이 있는지 확인하고 있다면 다음 줄의 첫 요소의 0에 커서 위치
      // 다음 줄
      const nextLine = curLine.nextElementSibling;
      if (nextLine) {
        console.log("다음 줄 있음");
        const firstContainer = nextLine.firstChild;

        cursorElement = firstContainer?.firstChild as HTMLElement;
        cursorPosition = 0;
      }
    }
  } else {
    console.log("현재 위치가 현재 요소의 문자열의 길이보다 작음");
    // 현재 위치가 현재 요소의 문자열의 길이보다 작은 경우 오른쪽으로 한 칸 이동
    cursorPosition += 1;
  }

  setCursorPosition(cursorElement, cursorPosition);
};

export { moveRight };
