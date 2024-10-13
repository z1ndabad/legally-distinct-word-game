"use client";

import { useState } from "react";
import { Game } from "./Game";
import styles from "./page.module.css";
import { wordList } from "@/lib/words";

export default function Page() {
  function getRandomWord() {
    const wordAt = Math.floor(Math.random() * wordList.length);
    return wordList[wordAt];
  }

  const startingWord = getRandomWord();

  const [word, setWord] = useState(startingWord);
  const refreshWord = () => {
    setWord(getRandomWord());
  };

  return (
    <div className={styles.page}>
      <h1>Legally-Distinct Word Game</h1>
      <Game targetWord={word} resetCallback={refreshWord} />
      <a href="https://github.com/z1ndabad/legally-distinct-word-game">
        Source code
      </a>
    </div>
  );
}
