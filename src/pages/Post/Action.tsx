import styles from "./Action.module.css";
import { SlBubble } from "react-icons/sl";
import { BiRepost } from "react-icons/bi";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { IoStatsChartOutline } from "react-icons/io5";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { RiShare2Line } from "react-icons/ri";
import { useState } from "react";
import Reposts from "./Reposts";
import { currentUser } from "../../data";
import { ActionsType } from "./Post";

interface ActionProps {
  actions: ActionsType;
  setActions: React.Dispatch<React.SetStateAction<ActionsType>>;
}

const Action = ({ actions, setActions }: ActionProps) => {
  const [showRepost, setShowRepost] = useState(false);
  const { id } = currentUser;

  const handleRepostModal = () => {
    setShowRepost(!showRepost);
  };

  const handleFavorites = () => {
    console.log("좋아요");
    if (actions.favorites.includes(id)) {
      // db에서 현재 유저의 아이디 삭제
      const newfavorites = actions.favorites.filter((fav) => fav !== id);

      setActions((prev) => ({
        ...prev,
        favorites: newfavorites,
      }));
    } else {
      // db에서 현재 유저의 아이디 추가
      setActions((prev) => ({
        ...prev,
        favorites: [...prev.favorites, id],
      }));
    }
  };
  return (
    <div className={styles.container}>
      <span className={`${styles.action} ${styles.replies}`} title="답글">
        <SlBubble className="icon" />
        {actions.replies.length}
      </span>
      <span
        className={`${styles.action} ${styles.reposts}`}
        title="재게시"
        onClick={handleRepostModal}
      >
        {showRepost && <Reposts />}
        <BiRepost className="icon" />
        {actions.reposts.length}
      </span>
      <span
        className={`${styles.action} ${styles.favorites}`}
        title="좋아요"
        onClick={handleFavorites}
      >
        {actions.favorites.includes(id) ? (
          <MdFavorite className="icon" />
        ) : (
          <MdFavoriteBorder className="icon" />
        )}
        {actions.favorites.length}
      </span>
      <span className={`${styles.action} ${styles.statics}`} title="통계">
        <IoStatsChartOutline className="icon" />
        {actions.views}
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
