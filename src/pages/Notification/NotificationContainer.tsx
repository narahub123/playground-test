import styles from "./NotificationContianer.module.css";

const NotificationContainer = () => {
  Notification.requestPermission().then((result) => {
    if (result === "granted") {
      console.log("하이");
    }
  });

  return <div className={styles.container}>NotificationContainer</div>;
};

export default NotificationContainer;
