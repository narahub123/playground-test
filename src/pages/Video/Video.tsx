import styles from "./Video.module.css";
import example from "../../assets/video2.mp4";
import subtitle from "../../assets/subtitle.vtt";
import Controlbar from "./Controlbar";
import { useEffect, useRef, useState } from "react";
import { countVideoLength } from "../../utils";
import CONSTANT from "../../constant";

export interface DurationType {
  current: string;
  full: string;
}
export type TimeType = {
  curTime: number;
  duration: number;
};

export type ForwardRefType = {
  playThumbRef: HTMLDivElement | null;
  timeRef: HTMLDivElement | null;
  volumeThumbRef: HTMLDivElement | null;
  volumeRef: HTMLDivElement | null;
};

const Video = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [hasSubtitle, setHasSubtitle] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // 마우스가 video 위에 있는지 확인하는 상태
  const [isOver, setIsOver] = useState(false);

  // 재생 시간 설정
  const [time, setTime] = useState<TimeType>({
    curTime: 0,
    duration: 0,
  });

  // 볼륨 설정
  const [volume, setVolume] = useState(0);

  // 음소거 설정
  const [isMuted, setIsMuted] = useState(true);

  const forwardRef = useRef<ForwardRefType>({
    playThumbRef: null,
    timeRef: null,
    volumeRef: null,
    volumeThumbRef: null,
  });

  // video에 포커스 주기
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.focus();
  }, []);

  // 총 시간 알아내기
  useEffect(() => {
    const totalTime = async () => {
      const duration = await countVideoLength(example);
      setTime((prev) => ({ ...prev, duration }));
    };

    totalTime();
  }, []);

  // 자막 설정
  useEffect(() => {
    if (!videoRef.current) return;

    // 자막이 존재하는 경우 설정
    if (videoRef.current.textTracks.length > 0) {
      setHasSubtitle(true);
      videoRef.current.textTracks[0].mode = CONSTANT.videoSubtitle
        ? "showing"
        : "hidden";
    } else {
      // 자막이 존재하지 않는 경우 설정
      setHasSubtitle(false);
    }
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
    forwardRef.current.playThumbRef?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLVideoElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const key = e.code;
    console.log("눌린 키", key);
    const { curTime, duration } = time;

    let newVolume = volume;
    let newTime = curTime;

    const audioStep = CONSTANT.videoAudioStep;
    const playStep = CONSTANT.videoTimeStep;
    // 스페이스: 재생 / 멈춤
    if (key === "Space") {
      handlePlay();
    } else if (key === "ArrowRight") {
      // ArrowRight : 5초 앞으로
      if (duration <= curTime + playStep) {
        newTime = duration;
      } else {
        newTime = curTime + playStep;
      }
    } else if (key === "ArrowLeft") {
      // ArrowLeft : 5초 뒤로
      if (curTime - playStep <= 0) {
        newTime = 0;
      } else {
        newTime = curTime - playStep;
      }
    } else if (key === "ArrowUp") {
      // ArrowUp : 10 크게
      if (1 <= video.volume + audioStep) {
        newVolume = 1;
      } else {
        newVolume = video.volume + audioStep;
      }
    } else if (key === "ArrowDown") {
      // ArrowDown : 10 작게
      if (video.volume - audioStep <= 0) {
        newVolume = 0;
      } else {
        newVolume = video.volume - audioStep;
      }
    }

    // 재생 시간 설정
    video.currentTime = newTime;
    setTime((prev) => ({
      ...prev,
      curTime: newTime,
    }));

    // 음량 설정
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume > 0 ? false : true);

    video.focus();
  };
  return (
    <div className={styles.container}>
      <video
        ref={videoRef}
        onClick={handlePlay}
        onMouseEnter={() => setIsOver(true)}
        onMouseLeave={() => setIsOver(false)}
        onKeyDown={(e) => handleKeyDown(e)}
        tabIndex={0}
      >
        <source src={example} />
        {subtitle && (
          <track
            kind="subtitles"
            srcLang="ko"
            src={subtitle}
            label="Korean"
            default
          />
        )}
      </video>
      {isOver && (
        <Controlbar
          videoRef={videoRef}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          handlePlay={handlePlay}
          time={time}
          setTime={setTime}
          ref={forwardRef}
          hasSubtitle={hasSubtitle}
          setIsOver={setIsOver}
          volume={volume}
          setVolume={setVolume}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
        />
      )}
    </div>
  );
};

export default Video;
