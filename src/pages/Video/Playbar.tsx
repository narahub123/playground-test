import { useEffect, useRef, useState } from "react";
import styles from "./Playbar.module.css";
import { TimeType } from "./Video";
type PlaybarProps = {
  time: TimeType;
  setTime: React.Dispatch<React.SetStateAction<TimeType>>;
  videoRef: React.RefObject<HTMLVideoElement>;
};
const Playbar = ({ time, setTime, videoRef }: PlaybarProps) => {
  const { curTime, duration } = time;
  const timeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isClicked, setIsClicked] = useState(false);

  // 시간 흐름에 따른 플레이 바 변화
  useEffect(() => {
    if (!timeRef.current) return;

    const playbar = timeRef.current;

    const percent = (curTime / duration) * 100;

    playbar.style.width = percent + "%";
  }, [curTime]);

  // 클릭을 통한 시간 이동
  const handleclick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!trackRef.current || !timeRef.current || !videoRef.current) return;

    const track = trackRef.current;
    const playbar = timeRef.current;
    const video = videoRef.current;

    const curXPosition = e.clientX;
    console.log("클릭한 위치", curXPosition);

    // thumb 초기 위치
    const startPosition = track.getBoundingClientRect().left;
    console.log("초기 위치", startPosition);

    // track 길이
    const trackWidth = track.getBoundingClientRect().width;
    console.log("트랙 길이", trackWidth);

    // 이동 거리
    const distance = curXPosition - startPosition;

    console.log("이동거리", distance);

    // 이동거리 / 트랙 길이
    const percent = distance / trackWidth;
    console.log("퍼센트", percent * 100);

    // thumb 이동 시키기
    playbar.style.width = percent * 100 + "%";

    // 재생 시간 이동하기
    console.log(duration * percent);
    const newTime = duration * percent;
    video.currentTime = newTime;
    setTime((prev) => ({ ...prev, curTime: newTime }));
  };

  // 드래그를 통한 시간 이동
  // thumb을 클릭하는 경우
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsClicked(true);
  };
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsClicked(false);
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (
      !isClicked ||
      !trackRef.current ||
      !timeRef.current ||
      !videoRef.current
    )
      return;

    const track = trackRef.current;
    const playbar = timeRef.current;
    const video = videoRef.current;

    const curXPosition = e.clientX;
    console.log("클릭한 위치", curXPosition);

    // thumb 초기 위치
    const startPosition = track.getBoundingClientRect().left;
    console.log("초기 위치", startPosition);

    // track 길이
    const trackWidth = track.getBoundingClientRect().width;
    console.log("트랙 길이", trackWidth);

    // 이동 거리
    const distance = curXPosition - startPosition;

    console.log("이동거리", distance);

    // 이동거리 / 트랙 길이
    const percent = distance / trackWidth;
    console.log("퍼센트", percent * 100);

    // thumb 이동 시키기
    playbar.style.width = percent * 100 + "%";

    // 재생 시간 이동하기
    console.log(duration * percent);
    const newTime = duration * percent;
    video.currentTime = newTime;
    setTime((prev) => ({ ...prev, curTime: newTime }));
  };

  console.log("현재 시간", time.curTime);
  console.log(isClicked);

  return (
    <div
      className={styles.container}
      onMouseMove={isClicked ? (e) => handleMouseMove(e) : undefined}
      onMouseUp={(e) => handleMouseUp(e)}
    >
      <div className={styles.trackWrapper}>
        <div
          className={styles.track}
          onClick={(e) => handleclick(e)}
          ref={trackRef}
        >
          <div className={styles.time} ref={timeRef}>
            <div className={styles.thumbWrapper}>
              <div
                className={styles.thumb}
                onMouseDown={(e) => handleMouseDown(e)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playbar;
