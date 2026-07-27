import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.text}>Такой страницы не существует.</p>
    </div>
  );
};

export default NotFound;
