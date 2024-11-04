import styles from "./Action.module.css";
import { SlBubble } from "react-icons/sl";
import { BiRepost } from "react-icons/bi";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { IoStatsChartOutline } from "react-icons/io5";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { RiShare2Line } from "react-icons/ri";

const Action = () => {
  return (
    <div className={styles.container}>
      <span className={`${styles.action} ${styles.replies}`} title="답글">
        <SlBubble className="icon" />
        답글
      </span>
      <span className={`${styles.action} ${styles.reposts}`} title="재게시">
        <BiRepost className="icon" />
        재게시
      </span>
      <span className={`${styles.action} ${styles.favorites}`} title="좋아요">
        <MdFavoriteBorder className="icon" />
        좋아요
      </span>
      <span className={`${styles.action} ${styles.statics}`} title="통계">
        <IoStatsChartOutline className="icon" />
        통계
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
