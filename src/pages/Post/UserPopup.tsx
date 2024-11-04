import styles from "./UserPopup.module.css";
import profile1 from "../../assets/profile1.jpg";
import { convertKoreanNumberUnit } from "../../utils/post";

interface UserPopup {
  id: string | undefined;
}

const user = {
  name: "몰러",
  id: "user1234",
  intro: "모르겠음",
  following: 723,
  followers: 134513200,
};

const mine = {
  following: ["user1234"],
};

const UserPopup = ({ id }: UserPopup) => {
  if (!id) return;
  // id 혹은 다른 요소로 해당 유저에 대한 정보를 가져옴
  // 지금은 예시라서 data를 사용

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.top}>
          <img src={profile1} alt="프로필" className={styles.profile} />
          <button className={styles.button}>
            {mine.following.includes(user.id) ? "팔로잉" : "팔로우"}
          </button>
        </div>
        <p className={styles.name}>{user.name}</p>
        <p className={styles.id}>@{user.id}</p>
        <p className={styles.intro}>{user.intro}</p>
        <div className={styles.data}>
          <p className={styles.number} title={user.following.toString()}>
            {convertKoreanNumberUnit(user.following)}
          </p>
          <p>팔로우 중 </p>
          <p className={styles.number} title={user.followers.toString()}>
            {convertKoreanNumberUnit(user.followers)}
          </p>
          <p>팔로워</p>
        </div>
      </div>
    </div>
  );
};

export default UserPopup;
