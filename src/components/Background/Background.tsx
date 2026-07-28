import { useState } from 'react';

import styles from './Background.module.css';

type BackgroundProps = {
  mobile: string;
  tablet: string;
  desktop: string;
};

const Background = ({ mobile, tablet, desktop }: BackgroundProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <picture className={styles.background}>
      <source media='(min-width: 1024px)' srcSet={desktop} />

      <source media='(min-width: 768px)' srcSet={tablet} />

      <img
        src={mobile}
        alt=''
        aria-hidden='true'
        fetchPriority='high'
        decoding='async'
        onLoad={() => setIsLoaded(true)}
        className={isLoaded ? styles.loaded : ''}
      />
    </picture>
  );
};

export default Background;
