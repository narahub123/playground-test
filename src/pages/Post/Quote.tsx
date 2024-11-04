import styles from "./Quote.module.css";
import { LuX } from "react-icons/lu";
import { PostType } from "./Post";
import profile from "../../assets/profile1.jpg";
import { convertDate } from "../../utils/post";
import { FaEarthAsia } from "react-icons/fa6";

interface QuoteProps {
  post: PostType;
}

const Quote = ({ post }: QuoteProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <LuX className="icon" />
          <p>초안</p>
        </div>
        <div className={styles.content}>
          <div className={styles.inner}>
            <div className={styles.left}>
              <img src={profile} alt="" className={styles.profile} />
            </div>
            <div className={styles.right}>
              <input
                type="text"
                className={styles.text}
                placeholder="내용 추가하기"
              />
              <div className={styles.post}>
                <div className={styles.postHeader}>
                  <img src={profile} alt="" className={styles.postProfile} />
                  <p className={styles.name}>{post.name}</p>
                  <p className={styles.id}>{post.id}</p>
                  <p className={styles.dot} />
                  <p className={styles.postDate}>
                    {convertDate(post.postDate)}
                  </p>
                </div>
                <div className={styles.postText}>{post.text}</div>
              </div>
            </div>
          </div>
          <div className={styles.info}>
            <FaEarthAsia className="icon" />
            모든 사람이 답글을 달 수 있습니다.
          </div>
        </div>
        <div className={styles.footer}>
          <button>인용하기</button>
        </div>
      </div>
    </div>
  );
};

export default Quote;
