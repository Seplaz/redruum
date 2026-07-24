import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import styles from './Meta.module.css';

type MetaProps = {
  icon: string;
  value: ReactNode;
};

const Meta = ({
  icon,
  value,
}: MetaProps) => {
  return (
    <motion.div
      className={styles.meta}
    >
      <span className={styles.value}>{value}</span>

      <img
        className={styles.icon}
        src={icon}
        alt=""
        aria-hidden="true"
      />
    </motion.div>
  );
};

export default Meta;