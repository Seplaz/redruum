import { useState } from "react";
import styles from "./Background.module.css";

type BackgroundProps = {
  image: string;
};

const BackgroundImage = ({ image }: BackgroundProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <img
      src={image}
      alt=""
      aria-hidden="true"
      fetchPriority="high"
      decoding="async"
      onLoad={() => setIsLoaded(true)}
      className={`${styles.background} ${isLoaded ? styles.loaded : ""}`}
    />
  );
};

const Background = ({ image }: BackgroundProps) => {
  return <BackgroundImage key={image} image={image} />;
};

export default Background;
