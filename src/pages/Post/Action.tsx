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
import { ActionsType, PostType } from "./Post";
import Share from "./Share";
import ShareToSns from "./ShareToSns";
import Reply from "./Reply";

interface ActionProps {
  actions: ActionsType;
  setActions: React.Dispatch<React.SetStateAction<ActionsType>>;
  postId: string;
  post: PostType;
}

const Action = ({ actions, setActions, postId, post }: ActionProps) => {
  const [showRepost, setShowRepost] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showSns, setShowSns] = useState(false);
  const [showReply, setShowReply] = useState(false);

  const [curUser, setCurUser] = useState({
    id: currentUser.id,
    bookmarks: currentUser.bookmarks,
  });
  // 재게시
  const handleRepostModal = () => {
    setShowRepost(!showRepost);
  };

  // 좋아요
  const handleFavorites = () => {
    console.log("좋아요");
    if (actions.favorites.includes(curUser.id)) {
      // db에서 현재 유저의 아이디 삭제
      const newfavorites = actions.favorites.filter(
        (fav) => fav !== curUser.id
      );

      setActions((prev) => ({
        ...prev,
        favorites: newfavorites,
      }));
    } else {
      // db에서 현재 유저의 아이디 추가
      setActions((prev) => ({
        ...prev,
        favorites: [...prev.favorites, curUser.id],
      }));
    }
  };

  //북마크
  const handleBookmarks = () => {
    if (curUser.bookmarks.includes(postId)) {
      // 실제로는 DB에서 해당 포스트 아이디를 삭제해야함
      const newBookmarks = curUser.bookmarks.filter((book) => book !== postId);
      setCurUser((prev) => ({
        ...prev,
        bookmarks: newBookmarks,
      }));
    } else {
      // 실제로는 DB에서 해당 포스트 아이디를 추가해야함
      setCurUser((prev) => ({
        ...prev,
        bookmarks: [...prev.bookmarks, postId],
      }));
    }
  };

  // 공유하기
  const handleShare = () => {
    setShowShare(!showShare);
  };

  // 답글 작성하기
  const handleReply = () => {
    setShowReply(true);
  };

  return (
    <>
      {showReply && <Reply post={post} />}
      <div className={styles.container}>
        <span
          className={`${styles.action} ${styles.replies}`}
          title="답글"
          onClick={handleReply}
        >
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
          {actions.favorites.includes(curUser.id) ? (
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
          {showSns && <ShareToSns setShowSns={setShowSns} />}
          <span onClick={handleBookmarks}>
            {curUser.bookmarks.includes(postId) ? (
              <BsBookmarkFill className="icon" title="북마크" />
            ) : (
              <BsBookmark className="icon" title="북마크" />
            )}
          </span>
          <span onClick={handleShare}>
            {showShare && (
              <Share postId={postId} id={post.id} setShowSns={setShowSns} />
            )}
            <RiShare2Line className="icon" title="공유하기" />
          </span>
        </span>
      </div>
    </>
  );
};

export default Action;
