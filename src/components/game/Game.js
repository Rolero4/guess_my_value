import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate, Router } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import "./Game.css";
import formatter from "../../utils/value-formatter";
import Score from "./score/Score";
import Player from "./player/Player";

const Choice = {
  Higher: "Higher",
  Lower: "Lower",
};

const showValueTimeout = 1000;

const Game = () => {
  const {
    record,
    Lives,
    Level,
    players,
    currentLevel,
    score,
    setScore,
    setCurrentLevel,
    lives,
    setLives,
    remainingLives,
    setRemainingLives,
    isGameInProgress,
    setIsGameInProgress,
    isGameOver,
    setIsGameOver,
  } = useOutletContext();

  const [usedIndexes, setUsedIndexes] = useState([]);
  const [previousPlayer, setPreviousPlayer] = useState(undefined);
  const [newPlayer, setNewPlayer] = useState(undefined);
  const [showValue, setShowValue] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setPreviousPlayer(players[getNewIndex()]);
    setNewPlayer(players[getNewIndex()]);
  }, [players]);

  useEffect(() => {
    if (isGameOver) navigate(`/game-over/${usedIndexes.at(-1)}`);
  }, [isGameOver]);

  const getNewIndex = () => {
    let index = Math.floor(Math.random() * 200);
    while (usedIndexes.includes(index)) {
      index = Math.floor(Math.random() * 200);
    }
    setUsedIndexes((prevUsedIndexes) => [...prevUsedIndexes, index]);
    return index;
  };

  const isChoiceCorrect = (choice) => {
    return (
      (parseFloat(previousPlayer.value) >= parseFloat(newPlayer.value) &&
        choice === Choice.Lower) ||
      (parseFloat(previousPlayer.value) <= parseFloat(newPlayer.value) &&
        choice === Choice.Higher)
    );
  };

  const nextTurn = (choice) => {
    if (isChoiceCorrect(choice)) {
      setScore((prevScore) => prevScore + 1);
      getNewPlayers();
    } else {
      setRemainingLives((prevRemainingLives) => {
        if (prevRemainingLives !== 1) getNewPlayers();
        return prevRemainingLives - 1;
      });
    }
  };

  const getNewPlayers = () => {
    setShowValue(true);
    setTimeout(() => {
      setPreviousPlayer(newPlayer);
      setNewPlayer(players[getNewIndex()]);
      setShowValue(false);
    }, showValueTimeout);
  };

  return (
    <>
      {previousPlayer && newPlayer ? (
        <div>
          <Score
            score={score}
            record={record[currentLevel]}
            livesCount={lives}
            livesLeft={remainingLives}
          />
          <div className="players-container">
            <Player
              name={previousPlayer?.name}
              value={formatter(previousPlayer?.value)}
              age={previousPlayer?.age}
              position={previousPlayer?.position}
              image={previousPlayer?.image_link}
            />
            <Player
              name={newPlayer?.name}
              value={showValue ? formatter(newPlayer?.value) : formatter("?")}
              age={newPlayer?.age}
              position={newPlayer?.position}
              image={newPlayer?.image_link}
            />
          </div>
          <div className="buttons-container">
            <button
              onClick={() => nextTurn(Choice.Higher)}
              className="higher-lower-button higher"
            >
              Higher
            </button>
            <button
              onClick={() => nextTurn(Choice.Lower)}
              className="higher-lower-button lower"
            >
              Lower
            </button>
          </div>
        </div>
      ) : (
        <ClipLoader loading={!previousPlayer && !newPlayer} size={150} />
      )}
    </>
  );
};

export default Game;
