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

export { countVideoLength, convertTimeToString };
