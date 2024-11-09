import { useEffect, useState } from "react";
import styles from "./NotificationContianer.module.css";
import CONSTANT from "../../constant";
import icon from "../../assets/naver.png";

const NotificationContainer = () => {
  const [permission, setPermission] = useState(CONSTANT.notificationPermission);
  // 푸시 알림 권한 획득하기
  //   Notification.requestPermission().then((result) => {
  //     if (result === "granted") {
  //       console.log("하이");
  //     }
  //   });

  // Notification.requestPermission() 메서드각 Promise를 반환하는지 확인하는 함수
  // 오래된 브라우저에서는 Promise를 반환하지 않고, 대신 콜백 함수를 인수로 전달하기 때문
  const checkNotificationPromise = () => {
    try {
      Notification.requestPermission().then();
    } catch (err) {
      return false;
    }

    return true;
  };

  // 푸시 알림 설정
  useEffect(() => {
    // 브라우저가 알림을 지원하지는 지원하는지 확인
    // 지원하지 않는 경우
    if (!("Notification" in window)) {
    } else {
      // 지원하는 경우

      if (checkNotificationPromise()) {
        // Promise를 반환하는 경우
        Notification.requestPermission().then((result) => {
          setPermission(result);
        });
      } else {
        // 콜백 함수를 인수로 전달해야 하는 경우
        Notification.requestPermission((result) => {
          setPermission(result);
        });
      }
    }
  }, []);

  const text = "아! 아리먼";

  const notification = new Notification("zz", { body: text, icon: icon });

  return <div className={styles.container}></div>;
};

export default NotificationContainer;
