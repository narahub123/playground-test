import styles from "./Video.module.css";
import example from "../../assets/video2.mp4";
import subtitle from "../../assets/subtitle.vtt";
import Controlbar from "./Controlbar";
import { useEffect, useRef, useState } from "react";
import { countVideoLength } from "../../utils";

export interface DurationType {
  current: string;
  full: string;
}
export type TimeType = {
  curTime: number;
  duration: number;
};

export type playType = {
  thumbRef: HTMLDivElement | null;
  timeRef: HTMLDivElement | null;
};

const Video = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const subRef = useRef<HTMLTrackElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const [time, setTime] = useState<TimeType>({
    curTime: 0,
    duration: 0,
  });

  const playRefs = useRef<playType>({
    thumbRef: null,
    timeRef: null,
  });

  // 총 시간 알아내기
  useEffect(() => {
    const totalTime = async () => {
      const duration = await countVideoLength(example);
      setTime((prev) => ({ ...prev, duration }));
    };

    totalTime();
  }, []);

  const getCurrentTime = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    // 재생시간이 업데이트 될 때 일어날 이벤트
    video.addEventListener("timeupdate", () => {
      // 현재 재생 시간 알아내기
      const curTime = video.currentTime;
      setTime((prev) => ({
        ...prev,
        curTime,
      }));
    });
  };

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      // 시간을 측정하는 함수도 멈춰야 함
      setIsPlaying(false);
      video.pause();
    } else {
      // 시간을 측정하는 함수도 시작해야 함
      setIsPlaying(true);
      video.play();
      getCurrentTime();
    }

    // 재생 thumb에 포커스 주기
    playRefs.current.thumbRef?.focus();
  };

  return (
    <div className={styles.container}>
      <video ref={videoRef} onClick={handlePlay}>
        <source src={example} />
        <track
          kind="subtitles"
          srcLang="ko"
          src={subtitle}
          label="Korean"
          default
          ref={subRef}
        />
      </video>
      <Controlbar
        videoRef={videoRef}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        handlePlay={handlePlay}
        time={time}
        setTime={setTime}
        ref={playRefs}
      />
    </div>
  );
};

export default Video;
