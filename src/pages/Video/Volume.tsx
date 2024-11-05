import styles from "./Volume.module.css";

const Volume = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.cover}>
          <div className={styles.track}>
            <div className={styles.volume} />
          </div>
          <div className={styles.thumbWrapper}>
            <div className={styles.thumb} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volume;
