import { useState } from "react";
import Upload from "./Upload";
import styles from "./VideoContainer.module.css";
import Video from "./Video";
export interface FileType {
  url: string;
  video: boolean;
}

const VideoContainer = () => {
  const [file, setFile] = useState<FileType>({
    url: "",
    video: false,
  });

  return (
    <div className={styles.wrapper}>
      <Upload setFile={setFile} />
      <Video />
    </div>
  );
};

export default VideoContainer;
