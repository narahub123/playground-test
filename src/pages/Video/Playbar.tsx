import { useEffect, useRef } from "react";
import styles from "./Playbar.module.css";
import { TimeType } from "./Video";
type PlaybarProps = {
  time: TimeType;
};
const Playbar = ({ time }: PlaybarProps) => {
  const { curTime, duration } = time;
  const timeRef = useRef<HTMLDivElement>(null);

  // 시간 흐름에 따른 플레이 바 변화
  useEffect(() => {
    if (!timeRef.current) return;

    const playbar = timeRef.current;

    const percent = (curTime / duration) * 100;

    playbar.style.width = percent + "%";
  }, [curTime]);

  return (
    <div className={styles.container}>
      <div className={styles.trackWrapper}>
        <div className={styles.track}>
          <div className={styles.time} ref={timeRef}>
            <div className={styles.thumbWrapper}>
              <div className={styles.thumb} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playbar;
