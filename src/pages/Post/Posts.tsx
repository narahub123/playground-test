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
        postId: "abcdef",
        name: "몰러",
        id: "abc1234",
        postDate: date1,
        replies: ["user111", "user123"],
        reposts: ["user111", "user123"],
        favorites: ["user111", "user123"],
        views: 111,
      },
    },
    {
      isReposted: false,
      rePoster: undefined,
      post: {
        postId: "abcdef1",
        name: "몰러",
        id: "abc1234",
        postDate: date2,
        replies: ["user111", "user123"],
        reposts: ["user111", "user123"],
        favorites: ["user111", "user123"],
        views: 111,
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
