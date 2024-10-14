import { ChangeEvent, FormEvent, useState } from "react";
import { Letter } from "./Letter";
import styles from "./page.module.css";

export type LetterState = {
  char: string;
  state: "correct" | "partial" | "incorrect" | "unused";
};

const WORDLENGTH = 5;
const NUMROUNDS = 6;

function compareLettersToTarget(letters: LetterState[], target: string) {
  const targetLetterFreqs = Array.from(target).reduce(
    (acc, curr) => {
      acc[curr] = acc.hasOwnProperty(curr) ? acc[curr] + 1 : 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    letters
      // Find correct characters first
      .map(({ char }, i): LetterState => {
        let newState: LetterState["state"] = "unused";
        if (char in targetLetterFreqs && char === target[i]) {
          newState = "correct";
          targetLetterFreqs[char]--;
        }

        return { char, state: newState };
      })
      // Only apply 'partial' state to letters whose frequency in the input, as of the current index,
      // is less than or equal to the frequency of that character in the target word
      // i.e. for target = 'mummy' and input = 'ummmm', return partial, partial, correct, correct, incorrect
      .map(({ char, state }): LetterState => {
        let newState: LetterState["state"] = state;
        if (state != "correct") {
          if (target.includes(char) && targetLetterFreqs[char] > 0) {
            newState = "partial";
            targetLetterFreqs[char]--;
          } else {
            newState = "incorrect";
          }
        }

        return { char, state: newState };
      })
  );
}

function stringToLetters(str: string): LetterState[] {
  return Array.from(str).map((char) => ({ char, state: "unused" }));
}

function lettersToString(letters: LetterState[]) {
  return letters.reduce((acc, curr) => acc.concat(curr.char), "");
}

interface GameProps {
  targetWord: string;
  resetCallback: () => void;
}

export function Game({ targetWord, resetCallback }: GameProps) {
  const emptyLetter: LetterState = { char: "", state: "unused" };
  const blankGame = new Array(NUMROUNDS).fill(
    new Array<LetterState>(WORDLENGTH).fill(emptyLetter),
  );

  const [currentRound, setCurrentRound] = useState(0);
  const [attempts, setAttempts] = useState<LetterState[][]>(blankGame);
  const hasWon =
    currentRound && lettersToString(attempts[currentRound - 1]) === targetWord;

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
        copy[currentRound] = compareLettersToTarget(
          copy[currentRound],
          targetWord,
        );
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
