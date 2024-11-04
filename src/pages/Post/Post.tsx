import { convertDate } from "../../utils/post";
import styles from "./Post.module.css";
import { BiRepost } from "react-icons/bi";
import UserPopup from "./UserPopup";
import { useState } from "react";
import Action from "./Action";
interface PostProps {
  isReposted: boolean;
  reposter: string | undefined;
  post: PostType | undefined;
}

interface PostType {
  name: string;
  id: string;
  postDate: Date;
  replies: string[];
  reposts: string[];
  favorites: string[];
  views: number;
}

export interface ActionsType {
  replies: string[];
  reposts: string[];
  favorites: string[];
  views: number;
}

const Post = ({ isReposted, reposter, post }: PostProps) => {
  if (!post) return;
  const [isShown, setIsShown] = useState(false);
  const [actions, setActions] = useState<ActionsType>({
    replies: post.replies,
    reposts: post.reposts,
    favorites: post.favorites,
    views: post.views,
  });
  // 유저 이름, 유저 아이디에 마우스를 올린 경우
  const handleMouseOver = () => {
    setIsShown(true);
  };

  const handleMouseOut = () => {
    setIsShown(false);
  };

  return (
    <>
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
          <div
            className={styles.header}
            onMouseOver={() => handleMouseOver()}
            onMouseOut={() => handleMouseOut()}
          >
            {isShown && <UserPopup id={post?.id} />}
            <p className={styles.name}>{post?.name}</p>

            <p className={styles.id}>@{post?.id}</p>
            <p className={styles.point} />
            <p
              className={styles.postDate}
              title={post?.postDate.toLocaleString()}
            >
              {convertDate(post?.postDate)}
            </p>
          </div>
          <div className={styles.content}>내용</div>
          <Action actions={actions} setActions={setActions} />
        </div>
      </div>
    </>
  );
};

export default Post;
