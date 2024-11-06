import { forwardRef, useRef, useState } from "react";
import styles from "./Volume.module.css";

interface VolumeProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  showVolume: boolean;
}

const Volume = forwardRef<HTMLDivElement, VolumeProps>(
  ({ videoRef, volume, setVolume, setIsMuted, showVolume }, ref) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const volumeRef = useRef<HTMLDivElement>(null);
    const bottom = Math.floor(
      trackRef.current?.getBoundingClientRect().bottom || 0
    );
    // console.log("트랙 바닥 위치", bottom);
    // const thumbRef = useRef<HTMLDivElement>(null);

    const [isClicked, setIsClicked] = useState(false);

    // 클릭을 통한 음량 조절
    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!trackRef.current || !volumeRef.current || !videoRef.current) return;

      const volume = volumeRef.current;
      const video = videoRef.current;

      const curYPosition = e.clientY;
      // console.log("현재의 y 위치", curYPosition);

      let height = bottom - curYPosition;

      if (height <= 0) {
        height = 0;
        setIsMuted(true);
      } else if (0 < height && height <= 100) {
        height = bottom - curYPosition;
        setIsMuted(false);
      } else if (100 < height) {
        height = 100;
        setIsMuted(false);
      }

      // console.log("높이", height);
      // console.log("음량", height / 100);

      video.volume = height / 100;
      setVolume(height / 100);
      volume.style.height = height + "px";
    };

    // thumb을 눌렀을 때
    const handleMouseDown = (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      console.log("mouse down");
      setIsClicked(true);
    };
    // thumb에서 마우스를 뺐을 때
    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      console.log("mouse up");
      setIsClicked(false);
    };

    // thumb이 클릭된 상태에서 마우스가 움직인 경우
    const hanldeMouseMove = (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      // thumb이 클릭된 상태가 아니라면 리턴
      if (!isClicked || !videoRef.current || !volumeRef.current) return;
      const video = videoRef.current;
      const height = volumeRef.current;

      // 현재 Y 위치
      const curYPosition = e.clientY;
      console.log("현재 Y 위치", curYPosition);

      let sound = bottom - curYPosition;
      console.log("음량", sound);

      if (sound <= 0) {
        sound = 0;
        setIsMuted(true);
      } else if (0 < sound && sound <= 100) {
        sound = bottom - curYPosition;
        setIsMuted(false);
      } else if (100 < sound) {
        sound = 100;
        setIsMuted(false);
      }

      // 실제 음량 조절
      video.volume = sound / 100;
      // 음량 상태 업데이트
      setVolume(sound / 100);
      // 음량 높이 변경
      height.style.height = sound + "px";
    };

    // 키보드를 통한 음량 조절
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!volumeRef.current || !videoRef.current) return;

      const video = videoRef.current;
      const height = volumeRef.current;

      const key = e.key;
      // 음량 조절 단위
      const step = 0.1;

      let newVolume = volume;

      if (key === "ArrowUp") {
        console.log("위쪽");
        if (video.volume >= 1) return;
        newVolume = volume + step >= 1 ? 1 : volume + step;
      } else if (key === "ArrowDown") {
        console.log("아래쪽");
        if (video.volume <= 0) return;
        newVolume = volume - step <= 0 ? 0 : volume - step;
        console.log(newVolume);
      }

      console.log(newVolume);

      video.volume = newVolume;
      setVolume(newVolume);
      height.style.height = newVolume * 100 + "px";
    };

    return (
      <div
        className={styles.wrapper}
        onMouseMove={isClicked ? (e) => hanldeMouseMove(e) : undefined}
        onMouseUp={(e) => handleMouseUp(e)}
      >
        <div className={styles.container}>
          <div className={styles.cover}>
            <div
              className={styles.track}
              ref={trackRef}
              onClick={(e) => handleClick(e)}
            >
              <div className={styles.volume} ref={volumeRef}>
                <div className={styles.thumbWrapper}>
                  <div
                    className={styles.thumb}
                    ref={ref}
                    onMouseDown={(e) => handleMouseDown(e)}
                    onKeyDown={(e) => handleKeyDown(e)}
                    tabIndex={0}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default Volume;
