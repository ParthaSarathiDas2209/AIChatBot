import styles from "./Loader.module.css";

export function Loader() {
  // Return a div with a class name from your CSS module for styling the overall container.
  return (
    <div className={styles.LoadMapper}>
      {/* This div represents the actual loading animation itself.  The styling will be defined in Loader.module.css */}
      <div className={styles.Loader}></div>
    </div>
  );
}
