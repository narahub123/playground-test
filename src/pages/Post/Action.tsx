import styles from "./Action.module.css";
import { SlBubble } from "react-icons/sl";
import { BiRepost } from "react-icons/bi";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { IoStatsChartOutline } from "react-icons/io5";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { RiShare2Line } from "react-icons/ri";
import { useState } from "react";
import Reposts from "./Reposts";

interface ActionProps {
  replies: string[];
  reposts: string[];
  favorites: string[];
  views: number;
}

const Action = ({ replies, reposts, favorites, views }: ActionProps) => {
  const [showRepost, setShowRepost] = useState(false);

  const handleRepostModal = () => {
    setShowRepost(!showRepost);
  };
  return (
    <div className={styles.container}>
      <span className={`${styles.action} ${styles.replies}`} title="답글">
        <SlBubble className="icon" />
        {replies.length}
      </span>
      <span
        className={`${styles.action} ${styles.reposts}`}
        title="재게시"
        onClick={handleRepostModal}
      >
        {showRepost && <Reposts />}
        <BiRepost className="icon" />
        {reposts.length}
      </span>
      <span className={`${styles.action} ${styles.favorites}`} title="좋아요">
        <MdFavoriteBorder className="icon" />
        {favorites.length}
      </span>
      <span className={`${styles.action} ${styles.statics}`} title="통계">
        <IoStatsChartOutline className="icon" />
        {views}
      </span>
      <span className={`${styles.action} ${styles.last}`}>
        <span>
          <BsBookmark className="icon" title="북마크" />
        </span>
        <span>
          <RiShare2Line className="icon" title="공유하기" />
        </span>
      </span>
    </div>
  );
};

export default Action;
