import styles from "./Video.module.css";
import example from "../../assets/video.mp4";
import Controlbar from "./Controlbar";

const Video = () => {
  return (
    <div className={styles.container}>
      <video>
        <source src={example} />
      </video>
      <Controlbar />
    </div>
  );
};

export default Video;
