import styles from "./Playbar.module.css";

const Playbar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.trackWrapper}>
        <div className={styles.track}>
          <div className={styles.time}>
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
