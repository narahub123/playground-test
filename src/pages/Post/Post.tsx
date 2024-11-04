import { convertDate } from "../../utils/post";
import styles from "./Post.module.css";
import { BiRepost } from "react-icons/bi";
interface PostProps {
  isReposted: boolean;
  reposter: string | undefined;
  post: PostType | undefined;
}

interface PostType {
  name: string;
  id: string;
  postDate: Date;
}

const Post = ({ isReposted, reposter, post }: PostProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <img src="" alt="프로필" className={styles.profile} />
        <div className={styles.vertical}></div>
      </div>
      <div className={styles.right}>
        {isReposted && (
          <div className={styles.repost}>
            <BiRepost className="icon" />
            {reposter}님이 재게시함
          </div>
        )}
        <div className={styles.header}>
          <p className={styles.name}>{post?.name}</p>

          <p className={styles.id}>@{post?.id}</p>
          <p className={styles.point} />
          <p className={styles.postDate}>{convertDate(post?.postDate)}</p>
        </div>
        <div className={styles.content}>내용</div>
        <div className={styles.action}>액션</div>
      </div>
    </div>
  );
};

export default Post;
