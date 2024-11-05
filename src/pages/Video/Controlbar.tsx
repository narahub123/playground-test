import { useState } from "react";
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

const Controlbar = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setValume] = useState(0);
  const [isCC, setIsCC] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [duration, setDuration] = useState({
    current: "0:00",
    full: "0:30",
  });

  return (
    <div className={styles.controlbar}>
      <div className={styles.progress}>
        <div className={styles.fill} />
      </div>
      <div className={styles.buttons}>
        <div className={styles.left}>
          {/* 플레이 버튼 */}
          <button className={styles.wrapper}>
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
          <button className={styles.wrapper}>
            {isCC ? (
              <FaClosedCaptioning className={`icon ${styles.btn}`} />
            ) : (
              <FaRegClosedCaptioning className={`icon ${styles.btn}`} />
            )}
          </button>
          {/* 소리 */}
          <button className={styles.wrapper}>
            {volume === 0 ? (
              <IoVolumeMuteSharp className={`icon ${styles.btn}`} />
            ) : 0 < volume && volume <= 25 ? (
              <IoVolumeLowSharp className={`icon ${styles.btn}`} />
            ) : 25 < volume && volume <= 75 ? (
              <IoVolumeMediumSharp className={`icon ${styles.btn}`} />
            ) : (
              <IoVolumeHighSharp className={`icon ${styles.btn}`} />
            )}
          </button>
          {/* 설정 */}
          <button className={styles.wrapper}>
            <IoSettingsOutline className={`icon ${styles.btn}`} />
          </button>
          {/* pip */}
          <button className={styles.wrapper}>
            <LuPictureInPicture className={`icon ${styles.btn}`} />
          </button>
          {/* 전체화면 */}
          <button className={styles.wrapper}>
            {isFullScreen ? (
              <MdFullscreenExit className={`icon ${styles.btn}`} />
            ) : (
              <MdOutlineFullscreen className={`icon ${styles.btn}`} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controlbar;
