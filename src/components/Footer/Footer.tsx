import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import logo from '../../assets/images/logo.svg';

import styles from './Footer.module.css';

const items = [
  {
    type: 'text',
    value: 'No likes.',
    duration: 2500,
  },
  {
    type: 'text',
    value: 'No followers.',
    duration: 2500,
  },
  {
    type: 'text',
    value: 'No profiles.',
    duration: 2500,
  },
  {
    type: 'logo',
    duration: 6500,
  },
] as const;

const Footer = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIndex((previous) => (previous + 1) % items.length);
    }, items[index].duration);

    return () => clearTimeout(timeout);
  }, [index]);

  const current = items[index];

  return (
    <footer className={styles.footer}>
      <AnimatePresence mode='wait'>
        <motion.div
          key={index}
          className={styles.manifesto}
          initial={{
            opacity: 0,
            y: 4,
            filter: 'blur(4px)',
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
          }}
          exit={{
            opacity: 0,
            y: -4,
            filter: 'blur(4px)',
          }}
          transition={{
            duration: 0.35,
            ease: 'easeInOut',
          }}
        >
          {current.type === 'text' ? (
            <span className={styles.text}>{current.value}</span>
          ) : (
            <img
              src={logo}
              alt='REDRUUM'
              className={styles.logo}
              draggable={false}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <span className={styles.text}>2026</span>
    </footer>
  );
};

export default Footer;
