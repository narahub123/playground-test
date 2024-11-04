import styles from "./Posts.module.css";
import Post from "./Post";

const Posts = () => {
  const posts = [
    {
      isReposted: true,
      reposter: "몰러",
    },
    {
      isReposted: false,
      rePoster: undefined,
    },
  ];
  return (
    <div className={styles.container}>
      {posts.map((post) => (
        <Post isReposted={post.isReposted} reposter={post.reposter} />
      ))}
    </div>
  );
};

export default Posts;
