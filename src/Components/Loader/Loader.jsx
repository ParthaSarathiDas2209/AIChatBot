import styles from "./Loader.module.css"; // Import scoped CSS module styles

export function Loader() {
  return (
    <div className={styles.LoadMapper}>
      {/* Animated loader circle or spinner (defined in CSS) */}
      <div className={styles.Loader}></div>
    </div>
  );
}
