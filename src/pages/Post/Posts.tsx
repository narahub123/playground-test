import styles from "./Posts.module.css";
import Post from "./Post";

const Posts = () => {
  const posts = [
    {
      isReposted: true,
      reposter: "몰러",
      //   repost: "기본키"
      post: {
        name: "몰러",
        id: "abc1234",
        postDate: new Date().toLocaleString(),
      },
    },
    {
      isReposted: false,
      rePoster: undefined,
      post: {
        name: "몰러",
        id: "abc1234",
        postDate: new Date().toLocaleString(),
      },
    },
  ];
  return (
    <div className={styles.container}>
      {posts.map((post) => (
        <Post
          isReposted={post.isReposted}
          reposter={post.reposter}
          post={post.post}
        />
      ))}
    </div>
  );
};

export default Posts;
