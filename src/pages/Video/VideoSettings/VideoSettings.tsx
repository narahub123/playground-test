import styles from "./VideoSettings.module.css";
import { FaRegPlayCircle } from "react-icons/fa";
import { FaArrowLeft, FaCircleCheck, FaRegCircle } from "react-icons/fa6";

import { BiBarChart } from "react-icons/bi";
import { useState } from "react";
import { playSpeedArr } from "../../../data/vidoe";
import { getNumberFromString } from "../../../utils";
import CONSTANT from "../../../constant";

type SettingsType = {
  speed: number;
  quality: number;
};

type VideoSettingsProps = {
  videoRef: React.RefObject<HTMLVideoElement>;
};

const VideoSettings = ({ videoRef }: VideoSettingsProps) => {
  const [page, setPage] = useState(0);
  const [settings, setSettings] = useState<SettingsType>({
    speed: CONSTANT.videoSpeed,
    quality: CONSTANT.videoQuality,
  });

  const handlePickSpeed = (speed: number) => {
    if (!videoRef.current) return;

    console.log(speed);

    setSettings((prev) => ({
      ...prev,
      speed,
    }));

    videoRef.current.playbackRate = speed;
  };

  return (
    <div className={styles.modal}>
      {page === 0 ? (
        <div className={styles.container}>
          <div className={styles.item} onClick={() => setPage(1)}>
            <FaRegPlayCircle className={`item ${styles.left}`} />
            <span className={styles.right}>
              <p className={styles.name}>재생속도</p>
              <p className={styles.dot} />
              <p className={styles.detail}>1배속</p>
            </span>
          </div>
          <div className={styles.item} onClick={() => setPage(2)}>
            <BiBarChart className={`item ${styles.left}`} />
            <span className={styles.right}>
              <p className={styles.name}>동영상 화질</p>
              <p className={styles.dot} />
              <p className={styles.detail}>자동(720p)</p>
            </span>
          </div>
        </div>
      ) : page === 1 ? (
        <div className={styles.container}>
          <div className={styles.header} onClick={() => setPage(0)}>
            <FaArrowLeft className={`icon`} />
            <span>재생속도</span>
          </div>
          <ul className={styles.content}>
            {playSpeedArr.map((speed) => (
              <li className={styles.choice} key={getNumberFromString(speed)}>
                <p className={styles.title}>{speed}</p>

                {getNumberFromString(speed) === settings.speed ? (
                  <FaCircleCheck className={`icon ${styles.pick}`} />
                ) : (
                  <FaRegCircle
                    className={`icon ${styles.pick}`}
                    onClick={() => handlePickSpeed(getNumberFromString(speed))}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.header}>
            <FaArrowLeft className={`icon`} onClick={() => setPage(0)} />
            <span>재생속도</span>
          </div>
          <div className={styles.content}>dafsdf</div>
        </div>
      )}
    </div>
  );
};

export default VideoSettings;
