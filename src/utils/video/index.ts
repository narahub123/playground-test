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

export { countVideoLength };
