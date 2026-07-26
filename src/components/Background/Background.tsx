import { useState } from "react";
import styles from "./Background.module.css";
import backgroundImage from "../../assets/images/background.webp";

const Background = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <img
      src={backgroundImage}
      alt=""
      aria-hidden="true"
      fetchPriority="high"
      decoding="async"
      onLoad={() => setIsLoaded(true)}
      className={`${styles.background} ${isLoaded ? styles.loaded : ""}`}
    />
  );
};

export default Background;
