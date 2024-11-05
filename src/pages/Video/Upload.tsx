import styles from "./Upload.module.css";
import { FileType } from "./VideoContainer";

interface UploadProps {
  setFile: React.Dispatch<React.SetStateAction<FileType>>;
}

const Upload = ({ setFile }: UploadProps) => {
  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log("파일 정보", file);

    // 미리 보기
    const url = URL.createObjectURL(file);
    console.log("createObjectURL에 의해 생성된 URL 정보", url);

    // 비디오 추가
    if (file.type.includes("video")) {
      setFile({
        url,
        video: file.type.includes("video"),
      });
    }
  };
  return (
    <div className={styles.container}>
      <input type="file" onChange={(e) => uploadFile(e)} />
    </div>
  );
};

export default Upload;
