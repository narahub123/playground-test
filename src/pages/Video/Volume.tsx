import { useRef } from "react";
import styles from "./Volume.module.css";

interface VolumeProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
}

const Volume = ({ videoRef, setVolume, setIsMuted }: VolumeProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!trackRef.current || !volumeRef.current || !videoRef.current) return;

    const volume = volumeRef.current;
    const video = videoRef.current;

    const bottom = Math.floor(trackRef.current.getBoundingClientRect().bottom);
    console.log("트랙 바닥 위치", bottom);

    const curYPosition = e.clientY;
    console.log("현재의 y 위치", curYPosition);

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

    console.log("높이", height);
    console.log("음량", height / 100);

    video.volume = height / 100;
    setVolume(height / 100);
    volume.style.height = height + "px";
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.cover}>
          <div
            className={styles.track}
            ref={trackRef}
            onClick={(e) => handleClick(e)}
          >
            <div className={styles.volume} ref={volumeRef}>
              <div className={styles.thumbWrapper}>
                <div className={styles.thumb} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volume;
