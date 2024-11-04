import styles from "./Reply.module.css";
import { LuX } from "react-icons/lu";
import profile from "../../assets/profile1.jpg";
import { PostType } from "./Post";
import { convertDate } from "../../utils/post";

interface ReplyProps {
  post: PostType;
}

const Reply = ({ post }: ReplyProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <LuX className="icon" />
          <p>초안</p>
        </div>
        <div className={styles.content}>
          <div className={styles.post}>
            <div className={styles.left}>
              <img src={profile} alt="" className={styles.profile} />
              <div className={styles.vertical} />
            </div>
            <div className={styles.right}>
              <div className={styles.postHeader}>
                <p className={styles.name}>{post.name}</p>
                <p className={styles.id}>@{post.id}</p>
                <p className={styles.dot} />
                <p className={styles.postDate}>{convertDate(post.postDate)}</p>
              </div>
              <p className={styles.text}>{post.text}</p>
            </div>
          </div>
          <div className={styles.reply}>
            <div className={styles.left}>
              <img src={profile} alt="" className={styles.profile} />
            </div>
            <div className={styles.right}>
              <input
                type="text"
                className={styles.text}
                placeholder="답글을 입력하세요."
              />
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <button>답글</button>
        </div>
      </div>
    </div>
  );
};

export default Reply;
