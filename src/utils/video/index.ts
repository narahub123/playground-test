const countVideoLength = async (url: string) => {
  let length = 0;

  await new Promise((resolve) => {
    const video = document.createElement("video");
    video.src = url;
    const timer = setInterval(() => {
      if (video.readyState === 4) {
        length = video.duration;
      }

      resolve("");
      clearInterval(timer);
    }, 100);
  });

  return length;
};

const convertTimeToString = (time: number) => {
  const ceiledTime = Math.ceil(time);

  const minutes = ceiledTime / 60;
  const seconds = ceiledTime % 60;

  return `${minutes < 1 ? 0 : Math.floor(minutes)}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

const displayDuration = (duration: number) => {
  // 포멧: 1:08:37
  let hours = "";
  let minutes = "";
  let seconds = "";

  // 3600초 이상 경우(1시간 이상)
  if (duration >= 3600) {
    hours = (duration / 60).toString();
    minutes = ((duration % 60) / 60).toString();
    seconds = Math.ceil((duration % 60) % 60).toString();
  } else if (60 <= duration && duration < 3600) {
    // 60초 이상 3600초 미만인 경우
    minutes = (duration / 60).toString();
    seconds = Math.ceil(duration % 60).toString();
  } else {
    // 60초 미만인 경우
    seconds = Math.ceil(duration).toString();
  }

  return `${hours ? hours + ":" : ""}${
    hours ? minutes.padStart(2, "0") : minutes ? minutes : 0
  }:${seconds.padStart(2, "0")}`;
};

const displayCurrentTime = (curTime: number, duration: number) => {
  // 포멧: 1:08:37
  let hours = "";
  let minutes = "";
  let seconds = "";

  // 3600초 이상 경우(1시간 이상)
  if (curTime >= 3600) {
    hours = (curTime / 60).toString();
    minutes = ((curTime % 60) / 60).toString();
    seconds =
      curTime === duration
        ? Math.ceil((curTime % 60) % 60).toString()
        : Math.floor((curTime % 60) % 60).toString();
  } else if (60 <= curTime && curTime < 3600) {
    // 60초 이상 3600초 미만인 경우
    minutes = (curTime / 60).toString();
    seconds =
      curTime === duration
        ? Math.ceil(curTime % 60).toString()
        : Math.floor(curTime % 60).toString();
  } else {
    // 60초 미만인 경우
    seconds =
      curTime === duration
        ? Math.ceil(curTime).toString()
        : Math.floor(curTime).toString();
  }

  return `${hours ? hours + ":" : ""}${
    hours ? minutes.padStart(2, "0") : minutes ? minutes : 0
  }:${seconds.padStart(2, "0")}`;
};

// 문자열에서 숫자만 추출하기
const getNumberFromString = (item: string) => {
  const regExp = /^[0-9][0-9.]*/;

  const result = item.match(regExp);

  const number = result ? Number(result[0]) : 1;

  return number;
};

export {
  countVideoLength,
  convertTimeToString,
  displayDuration,
  displayCurrentTime,
  getNumberFromString,
};
