import { useState } from "react";
import Upload from "./Upload";
import styles from "./VideoContainer.module.css";
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
      {file.video && <video src={file.url} controls width={"250px"} />}
    </div>
  );
};

export default VideoContainer;

