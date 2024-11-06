import { useEffect, useRef, useState } from "react";
import styles from "./Controlbar.module.css";
import {
  IoPlaySharp,
  IoPause,
  IoVolumeHighSharp,
  IoVolumeMediumSharp,
  IoVolumeLowSharp,
  IoVolumeMuteSharp,
  IoSettingsOutline,
} from "react-icons/io5";
import { FaClosedCaptioning, FaRegClosedCaptioning } from "react-icons/fa6";
import { LuPictureInPicture } from "react-icons/lu";
import { MdOutlineFullscreen, MdFullscreenExit } from "react-icons/md";
import { DurationType } from "./Video";
import Volume from "./Volume";

interface ControlbarProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  handlePlay: () => void;
  isPlaying: boolean;
  duration: DurationType;
}

const Controlbar = ({
  videoRef,
  handlePlay,
  isPlaying,
  duration,
}: ControlbarProps) => {
  //   const thumbRef = useRef<HTMLDivElement>(null);

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [showVolume, setShowVolumne] = useState(false);
  const [isCC, setIsCC] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // 영상 시작할 때 소리 줄이기
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    // 볼륨 0으로 설정
    video.volume = 0;
    // 음소거 지정
    setIsMuted(true);
    // 볼륨 높이도 0으로 지정해야 함
  }, []);

  // 소리 묵음 / 소리 나게
  const handleMute = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    // 볼륨이 0이 아닌 경우
    if (video.volume !== 0) {
      // 볼륨을 0으로 지정
      video.volume = 0;

      // 높이 지정해야 함
    } else {
      // 볼륨이 0인 경우
      video.volume = volume;

      // 높이 지정해야 함
    }

    setIsMuted(!isMuted);
  };

  // 음량 모달 보이게
  const handleMouseEnter = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    console.log("들어옴");
    setShowVolumne(true);
  };

  // 음량 모달 숨기게
  const handleMouseLeave = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    console.log("나감");
    setShowVolumne(false);
  };

  return (
    <div className={styles.controlbar}>
      <div className={styles.progress}>
        <div className={styles.fill} />
      </div>
      <div className={styles.buttons}>
        <div className={styles.left}>
          {/* 플레이 버튼 */}
          <button className={styles.wrapper} onClick={handlePlay}>
            {isPlaying ? (
              <IoPause className={`icon ${styles.btn}`} />
            ) : (
              <IoPlaySharp className={`icon ${styles.btn}`} />
            )}
          </button>
        </div>
        <div className={styles.right}>
          {/* 현재 시간 / 전체 시간 */}
          <span className={styles.duration}>
            {`${duration.current} / ${duration.full}`}
          </span>
          {/* CC */}
          <span>
            <button className={styles.wrapper}>
              {isCC ? (
                <FaClosedCaptioning className={`icon ${styles.btn}`} />
              ) : (
                <FaRegClosedCaptioning className={`icon ${styles.btn}`} />
              )}
            </button>
          </span>
          <span
            className={styles.volume}
            onMouseEnter={(e) => handleMouseEnter(e)}
            onMouseLeave={(e) => handleMouseLeave(e)}
          >
            {/* 음량 창 */}
            {showVolume && (
              <Volume
                videoRef={videoRef}
                volume={volume}
                setVolume={setVolume}
                setIsMuted={setIsMuted}
                showVolume={showVolume}
              />
            )}
            {/* 소리 */}
            <button className={styles.wrapper} onClick={(e) => handleMute(e)}>
              {volume === 0 || isMuted ? (
                <IoVolumeMuteSharp className={`icon ${styles.btn}`} />
              ) : 0 < volume && volume <= 0.25 && !isMuted ? (
                <IoVolumeLowSharp className={`icon ${styles.btn}`} />
              ) : 0.25 < volume && volume <= 0.75 && !isMuted ? (
                <IoVolumeMediumSharp className={`icon ${styles.btn}`} />
              ) : volume > 0.75 && !isMuted ? (
                <IoVolumeHighSharp className={`icon ${styles.btn}`} />
              ) : undefined}
            </button>
          </span>

          {/* 설정 */}
          <span>
            <button className={styles.wrapper}>
              <IoSettingsOutline className={`icon ${styles.btn}`} />
            </button>
          </span>

          {/* pip */}
          <span>
            <button className={styles.wrapper}>
              <LuPictureInPicture className={`icon ${styles.btn}`} />
            </button>
          </span>
          {/* 전체화면 */}
          <span>
            <button className={styles.wrapper}>
              {isFullScreen ? (
                <MdFullscreenExit className={`icon ${styles.btn}`} />
              ) : (
                <MdOutlineFullscreen className={`icon ${styles.btn}`} />
              )}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Controlbar;
