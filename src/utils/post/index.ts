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

export { convertDate };
