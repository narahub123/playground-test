import styles from "./VideoSettings.module.css";
import { FaRegPlayCircle } from "react-icons/fa";
import { BiBarChart } from "react-icons/bi";

const VideoSettings = () => {
  return (
    <div className={styles.modal}>
      <div className={styles.item}>
        <FaRegPlayCircle className={`item ${styles.left}`} />
        <span className={styles.right}>
          <p className={styles.name}>재생속도</p>
          <p className={styles.dot} />
          <p className={styles.detail}>1배속</p>
        </span>
      </div>
      <div className={styles.item}>
        <BiBarChart className={`item ${styles.left}`} />
        <span className={styles.right}>
          <p className={styles.name}>동영상 화질</p>
          <p className={styles.dot} />
          <p className={styles.detail}>자동(720p)</p>
        </span>
      </div>
    </div>
  );
};

export default VideoSettings;
