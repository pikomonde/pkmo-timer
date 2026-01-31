import styles from './WindowWrapper.module.css';

export const WindowWrapper = ({ children }) => {
  return (
    <div className={styles.osWindowContainer}>
      <div className={styles.osWindow}>
        <div className={styles.titleBar}>
          <div className={styles.controls}>
            <span className={styles.close}></span>
            <span className={styles.minimize}></span>
            <span className={styles.maximize}></span>
          </div>
          <div className={styles.title}>PikoMo Multi-Timer CountDown</div>
        </div>
        {children}
      </div>
    </div>
  );
};
