import { Link } from 'react-router-dom';
import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.text}>Такой страницы не существует.</p>
      <Link className={styles.link} to="/">
        Вернуться на главную
      </Link>
    </div>
  );
};

export default NotFound;
