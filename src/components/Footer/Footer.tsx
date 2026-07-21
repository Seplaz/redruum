import styles from "./Footer.module.css";
import logo from "../../assets/images/logo.svg";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <img className={styles.logo} src={logo} alt="REDRUUM" />
      <span className={styles.text}>2026</span>
    </footer>
  );
};

export default Footer;
