import styles from "./Posts.module.css";
import Post from "./Post";

const Posts = () => {
  const now1 = new Date();
  const now2 = new Date();
  const date1 = new Date(now1.setMinutes(now1.getMinutes() - 10));
  const date2 = new Date(now2.setDate(now2.getDate() - 2));
  const posts = [
    {
      isReposted: true,
      reposter: "몰러",
      //   repost: "기본키"
      post: {
        name: "몰러",
        id: "abc1234",
        postDate: date1,
      },
    },
    {
      isReposted: false,
      rePoster: undefined,
      post: {
        name: "몰러",
        id: "abc1234",
        postDate: date2,
      },
    },
  ];
  return (
    <div className={styles.container}>
      {posts.map((post, index) => (
        <Post
          key={index}
          isReposted={post.isReposted}
          reposter={post.reposter}
          post={post.post}
        />
      ))}
    </div>
  );
};

export default Posts;
