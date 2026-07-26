import styles from "./ReplyMeta.module.css";
import { pluralize } from "../../utils/pluralize";

type ReplyMetaProps = {
  value: number;
};

const ReplyMeta = ({ value }: ReplyMetaProps) => {
  return (
    <div className={styles.meta}>
      <p className={styles.value}>{value}</p>
      <p className={styles.text}>
        {pluralize(value, "Ответ", "Ответа", "Ответов")}
      </p>
    </div>
  );
};

export default ReplyMeta;
