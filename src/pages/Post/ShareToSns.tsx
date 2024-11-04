import styles from "./ShareToSns.module.css";
import gmail from "../../assets/gmail.png";
import kakaotalk from "../../assets/kakaotalk.png";
import naver from "../../assets/naver.png";

interface ShareToSnsProps {
  setShowSns: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShareToSns = ({ setShowSns }: ShareToSnsProps) => {
  const handleShareToSns = () => {
    setShowSns(false);
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper} onClick={handleShareToSns}>
        <span className={styles.item}>
          <img src={gmail} alt="로고" className={styles.logo} />
          <p className={styles.title}>지메일</p>
        </span>
        <span className={styles.item}>
          <img src={kakaotalk} alt="로고" className={styles.logo} />
          <p className={styles.title}>카카오톡</p>
        </span>
        <span className={styles.item}>
          <img src={naver} alt="로고" className={styles.logo} />
          <p className={styles.title}>지메일</p>
        </span>
      </div>
    </div>
  );
};

export default ShareToSns;
