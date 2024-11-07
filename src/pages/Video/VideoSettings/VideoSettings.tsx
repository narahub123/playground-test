import styles from "./VideoSettings.module.css";
import { FaRegPlayCircle } from "react-icons/fa";
import { FaArrowLeft, FaCircleCheck, FaRegCircle } from "react-icons/fa6";

import { BiBarChart } from "react-icons/bi";
import { useState } from "react";
import { playSpeedArr, vidoeQualityArr } from "../../../data/vidoe";
import { getNumberFromString } from "../../../utils";
import CONSTANT from "../../../constant";

type SettingsType = {
  speed: string;
  quality: string;
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

  // 재생 속도 변경 
  const handlePickSpeed = (pick: string) => {
    if (!videoRef.current) return;

    const speed = getNumberFromString(pick);

    setSettings((prev) => ({
      ...prev,
      speed: pick,
    }));

    videoRef.current.playbackRate = speed;
  };

  // 동영상 화질 변경 : 실제로 구현하지 못함 
  const handlePickQuality = (quality: string) => {
    if (!videoRef.current) return;

    setSettings((prev) => ({
      ...prev,
      quality,
    }));
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
              <p className={styles.detail}>{settings.speed}</p>
            </span>
          </div>
          <div className={styles.item} onClick={() => setPage(2)}>
            <BiBarChart className={`item ${styles.left}`} />
            <span className={styles.right}>
              <p className={styles.name}>동영상 화질</p>
              <p className={styles.dot} />
              <p className={styles.detail}>{settings.quality}</p>
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
              <li className={styles.choice} key={speed}>
                <p className={styles.title}>{speed}</p>

                {speed === settings.speed ? (
                  <FaCircleCheck className={`icon ${styles.pick}`} />
                ) : (
                  <FaRegCircle
                    className={`icon ${styles.pick}`}
                    onClick={() => handlePickSpeed(speed)}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.header} onClick={() => setPage(0)}>
            <FaArrowLeft className={`icon`} />
            <span>동영상 화질</span>
          </div>
          <ul className={styles.content}>
            {vidoeQualityArr.map((quality) => (
              <li className={styles.choice} key={quality}>
                <p className={styles.title}>{quality}</p>

                {quality === settings.quality ? (
                  <FaCircleCheck className={`icon ${styles.pick}`} />
                ) : (
                  <FaRegCircle
                    className={`icon ${styles.pick}`}
                    onClick={() => handlePickQuality(quality)}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VideoSettings;
