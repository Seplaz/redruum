import styles from './Header.module.css';
import logo from '../../assets/images/header_logo.svg';

const Header = () => {
  return (
    <header className={styles.header}>
      <img className={styles.logo} src={logo} alt='REDRUUM' />
      <div className={styles.header_right}></div>
    </header>
  );
};

export default Header;
