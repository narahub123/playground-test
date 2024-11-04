const convertDate = (date: Date | undefined) => {
  if (!date) return;
  let postDate = date.toLocaleString();
  const newDate = new Date(date).getTime();

  const now = new Date().getTime();

  const gap = Math.floor((now - newDate) / (1000 * 60));

  if (gap >= 0 && gap <= 1) {
    postDate = "지금";
  } else if (gap < 60) {
    postDate = `${gap}분`;
  } else if (gap >= 60 && gap < 1440) {
    postDate = `${Math.floor(gap / 60)}시간`;
  } else if (gap >= 1440) {
    const day = date.getDate();
    const month = date.getMonth();
    postDate = `${month + 1}월${day}일`;
  }

  return postDate;
};

// 특정 단위 이상의 숫자를 한글 단위로 바꾸는 메서드
const convertKoreanNumberUnit = (num: number) => {
  let unit;
  if (num < 1000) {
    unit = num;
  } else if (num >= 1000 && num < 10000) {
    unit = (num / 1000).toFixed(1) + "천";
  } else if (num >= 10000 && num < 1000000) {
    unit = (num / 10000).toFixed(1) + "만";
  } else if (num >= 1000000 && num < 100000000) {
    unit = Math.floor(num / 10000) + "만";
  } else if (num >= 100000000) {
    unit = (num / 100000000).toFixed(1) + "억";
  }
  return unit;
};

export { convertDate, convertKoreanNumberUnit };
