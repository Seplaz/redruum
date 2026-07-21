import type { ReactNode } from "react";
import type { HTMLMotionProps } from "motion/react";
import { motion } from "motion/react";
import styles from "./Button.module.css";
import { transitions } from "../../animations/transitions";

type IconPosition = "start" | "end";

type ButtonProps = HTMLMotionProps<"button"> & {
  icon?: string;
  text?: ReactNode;
  iconPosition?: IconPosition;
};

const Button = ({
  icon,
  text,
  iconPosition = "start",
  ...props
}: ButtonProps) => {
  return (
    <motion.button
      className={styles.button}
      whileTap={{ scale: 0.9 }}
      transition={transitions.fast}
      {...props}
    >
      {icon && iconPosition === "start" && (
        <img className={styles.icon} src={icon} alt="" aria-hidden="true" />
      )}

      {text && <span className={styles.label}>{text}</span>}

      {icon && iconPosition === "end" && (
        <img className={styles.icon} src={icon} alt="" aria-hidden="true" />
      )}
    </motion.button>
  );
};

export default Button;
