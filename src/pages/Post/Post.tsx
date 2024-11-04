import post from "./Post.module.css";

const Post = () => {
  return (
    <div className={post.container}>
      <div className={post.left}>
        <img src="" alt="프로필" className={post.profile} />
        <div className={post.vertical}></div>
      </div>
      <div className={post.right}>
        <div className={post.repost}>재게시</div>
        <div className={post.header}>헤더</div>
        <div className={post.content}>내용</div>
        <div className={post.action}>액션</div>
      </div>
    </div>
  );
};

export default Post;
