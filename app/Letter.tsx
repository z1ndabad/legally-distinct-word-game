import { LetterState } from "./Game";
import styles from "./page.module.css";

const nbsp = "\u00A0";

export function Letter({ char, state }: LetterState) {
  return (
    <div className={`${styles.letter} ${styles[state]}`}>{char ?? nbsp}</div>
  );
}
