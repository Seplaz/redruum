import styles from './Title.module.css';

type TitleProps = {
  children: React.ReactNode;
};

const Title = ({ children }: TitleProps) => {
  return (
    <h1 className={styles.title}>{children}</h1>
  )
}

export default Title;