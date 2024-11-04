import styles from "./Reposts.module.css";
import { BiRepost } from "react-icons/bi";
import { PiPencilSimpleLineLight } from "react-icons/pi";

interface RepostsProps {
  setShowQuote: React.Dispatch<React.SetStateAction<boolean>>;
}

const Reposts = ({ setShowQuote }: RepostsProps) => {
  // 재게시
  const handleReport = () => {
    console.log("재게시");
    // post 모델의 reposts에 현재 유저의 아이디 추가

    // 현재 유저의 post에 해당 게시물 추가
  };
  // 인용하기
  const handleQuote = () => {
    console.log("인용하기");
    setShowQuote(true);
  };
  return (
    <div className={styles.container}>
      <div className={styles.item} onClick={handleReport}>
        <BiRepost className="icon" /> 재게시
      </div>
      <div className={styles.item} onClick={handleQuote}>
        <PiPencilSimpleLineLight className="icon" /> 인용하기
      </div>
    </div>
  );
};

export default Reposts;
