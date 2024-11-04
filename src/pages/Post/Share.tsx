import styles from "./Share.module.css";
import { BsLink45Deg, BsEnvelope } from "react-icons/bs";
import { RiShare2Line } from "react-icons/ri";

interface ShareProps {
  postId: string;
  id: string;
  setShowSns: React.Dispatch<React.SetStateAction<boolean>>;
}

const Share = ({ postId, id, setShowSns }: ShareProps) => {
  // 링크를 클립복사에 삽입하기
  const handleCopyLink = () => {
    const url = `x.com/${id}/status/${postId}`;

    navigator.clipboard
      .writeText(url)
      .then(() => console.log("링크 복사"))
      .catch((err) => console.log(err));
  };

  const handleShareToSns = () => {
    setShowSns(true);
  };

  return (
    <div className={styles.container}>
      <p className={styles.item} onClick={handleCopyLink}>
        <BsLink45Deg className="item" /> 링크 복사하기
      </p>
      <p className={styles.item} onClick={handleShareToSns}>
        <RiShare2Line className="item" /> 게시물 공유하기
      </p>
      <p className={styles.item}>
        <BsEnvelope className="item" /> 쪽지로 보내기
      </p>
    </div>
  );
};

export default Share;
