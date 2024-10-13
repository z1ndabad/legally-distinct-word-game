import { ChangeEvent, FormEvent, useState } from "react";
import { Letter } from "./Letter";
import styles from "./page.module.css";

export type LetterState = {
  char: string | null;
  state: "correct" | "partial" | "incorrect" | "unused";
};

const WORDLENGTH = 5;
const NUMROUNDS = 6;

function compareLettersAt(
  letter: string,
  targetWord: string,
  idx: number,
): LetterState["state"] {
  let res: LetterState["state"] = "incorrect";
  if (letter === targetWord[idx]) {
    res = "correct";
  } else if (targetWord.includes(letter)) {
    res = "partial";
  }

  return res;
}

function stringToLetters(str: string): LetterState[] {
  return Array.from(str).map((char) => ({ char, state: "unused" }));
}

function lettersToString(letters: LetterState[]): string {
  return letters.reduce((acc, { char }) => acc + char, "");
}

interface GameProps {
  targetWord: string;
  resetCallback: () => void;
}

export function Game({ targetWord, resetCallback }: GameProps) {
  const emptyLetter: LetterState = { char: null, state: "unused" };
  const blankGame = new Array(NUMROUNDS).fill(
    new Array<LetterState>(WORDLENGTH).fill(emptyLetter),
  );

  const [currentRound, setCurrentRound] = useState(0);
  const [attempts, setAttempts] = useState<LetterState[][]>(blankGame);
  const hasWon =
    currentRound &&
    lettersToString(attempts[currentRound - 1]).toLowerCase() ===
      targetWord.toLowerCase();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAttempts((prev) => {
      const copy = window.structuredClone(prev);
      const letters = stringToLetters(e.target.value);
      const padding = new Array(WORDLENGTH - letters.length).fill(emptyLetter);
      copy[currentRound] = letters.concat(padding);
      return copy;
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    const lastChar = attempts[currentRound][WORDLENGTH - 1].char;
    e.preventDefault();
    if (lastChar) {
      e.currentTarget.reset();

      setAttempts((prev) => {
        const copy = window.structuredClone(prev);
        copy[currentRound] = copy[currentRound].map(({ char }, i) => ({
          char,
          state: compareLettersAt(
            char!.toLowerCase(),
            targetWord.toLowerCase(),
            i,
          ),
        }));
        return copy;
      });

      setCurrentRound((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setAttempts(blankGame);
    setCurrentRound(0);
    resetCallback();
  };

  return (
    <>
      <div id="game-board" className={styles.gameBoard}>
        {attempts.map((guess, i) => (
          <div className={styles.gameRow} key={i}>
            {guess.map(({ char, state }, i) => (
              <Letter key={i} char={char} state={state} />
            ))}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="guess"
          placeholder={hasWon ? "You win!" : "Type your guess"}
          maxLength={WORDLENGTH}
          onChange={handleChange}
          autoFocus
          className={styles.wordInput}
          disabled={hasWon || currentRound == NUMROUNDS}
        />
      </form>
      <button className={styles.newGame} onClick={handleReset}>
        New Game
      </button>
    </>
  );
}
