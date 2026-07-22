import styles from './Text.module.css';

type TextProps = {
  children: React.ReactNode;
};

const Text = ({ children }: TextProps) => {
  return (
    <h1 className={styles.text}>{children}</h1>
  )
}

export default Text;
