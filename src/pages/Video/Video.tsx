import styles from "./Video.module.css";
import example from "../../assets/video2.mp4";
import Controlbar from "./Controlbar";
import { useEffect, useRef, useState } from "react";
import { convertTimeToString, countVideoLength } from "../../utils";

export interface DurationType {
  current: string;
  full: string;
}

const Video = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<DurationType>({
    current: "0:00",
    full: "0:00s",
  });

  // 총 시간 알아내기
  useEffect(() => {
    const totalTime = async () => {
      const time = await countVideoLength(example);

      const full = convertTimeToString(time);

      setDuration((prev) => ({
        ...prev,
        full,
      }));
    };

    totalTime();
  }, []);

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
    }
  };

  return (
    <div className={styles.container}>
      <video ref={videoRef} onClick={handlePlay}>
        <source src={example} />
      </video>
      <Controlbar
        videoRef={videoRef}
        isPlaying={isPlaying}
        duration={duration}
        handlePlay={handlePlay}
      />
    </div>
  );
};

export default Video;
