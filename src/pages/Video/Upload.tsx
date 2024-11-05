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

    const fileSize = file.size;
    console.log("파일 사이즈", fileSize);

    // 파일 용량 제한하기
    const maxSize = 10 * 1024 * 1024; // 10mb
    if (fileSize > maxSize) {
      window.alert("10mb 이하의 동영상을 사용해주세요.");

      setFile({ url: "", video: false });
      e.target.value = ""; // input value 초기화
      return;
    }

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
