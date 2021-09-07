import React, { useState, useEffect, useRef } from "react";

const Game = () => {
  const [active_game, setActive_game] = useState(false);
  const [finished_game, setFinished_game] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [dealerCount, setDealerCount] = useState(0);
  const [playerCount, setPlayerCount] = useState(0);

  const finished_game_ref = useRef();
  const active_game_ref = useRef();
  const dealer_count_ref = useRef();

  let stay_btn_ref = useRef();
  let hit_btn_ref = useRef();
  let deal_btn_ref = useRef();

  finished_game_ref.current = finished_game;
  active_game_ref.current = active_game;
  dealer_count_ref.current = dealerCount;

  //Handles when the player chooses to stay
  const finish = async () => {
    if (active_game_ref.current && !finished_game_ref.current) {
      await setFinished_game(true);
      await stay_btn_ref.current.setAttribute("disabled","disabled");
      await hit_btn_ref.current.setAttribute("disabled","disabled");
    }

    if (finished_game_ref.current) {
      var buttons = document.querySelectorAll("button");
      buttons.disabled = true;

      setTimeout(() => {
        setDealerCount(
          (dealerCount) =>
            dealerCount + Math.floor(Math.random() * (11 - 1)) + 1
        );
      }, 750);
    }
  };

  useEffect(() => {
    if (finished_game_ref.current) {
      console.log("finished Game");
      if (dealer_count_ref.current < 17 && active_game_ref.current) {
        console.log("less than 17 and game is active ");
        finish();
      } else {
        var buttons = document.querySelectorAll("button");
        buttons.disabled = false;
        setActive_game(false);
        setShowResult(true);
        deal_btn_ref.current.removeAttribute("disabled");
      }
    }
  }, [dealerCount]);

  //Handles when the player hits
  const playerHit = () => {
    if (active_game_ref.current) {
      setPlayerCount(
        (playerCount) => playerCount + Math.floor(Math.random() * (11 - 1)) + 1
      );
    }
  };

  useEffect(() => {
    if (playerCount > 21) {
      setActive_game(false);
      setFinished_game(true);
    }
  }, [playerCount]);

  const Result = () => {
    if (showResult) {
      if (
        dealerCount > 21 ||
        (playerCount > dealerCount && playerCount <= 21)
      ) {
        return (
          <>
            <h1>You Won!</h1>
          </>
        );
      } else if (playerCount > 21 || dealerCount > playerCount) {
        return (
          <>
            <h1>You Lost!</h1>
          </>
        );
      } else {
        return (
          <>
            <h1>Push</h1>
          </>
        );
      }
    } else {
      return <h1></h1>;
    }
  };

  //Start the game
  const deal = () => {
    setActive_game(true);
    setFinished_game(false);
    setDealerCount(Math.floor(Math.random() * (11 - 1)) + 1);
    setPlayerCount(0);
    setShowResult(false);
    stay_btn_ref.current.removeAttribute("disabled");
    hit_btn_ref.current.removeAttribute("disabled");
    deal_btn_ref.current.setAttribute("disabled","disabled");
  };

  return (
    <>
      <div className="dealer">
        <h1>Dealer</h1>
        <h2>{dealerCount}</h2>
      </div>

      <div className="player">
        <h1>Player</h1>
        <h2>{playerCount}</h2>
      </div>

      <div className="buttons">
        <button ref={hit_btn_ref} onClick={playerHit}>Hit</button>
        <button ref={stay_btn_ref} onClick={finish}>Stay</button>
      </div>

      <button ref={deal_btn_ref} onClick={deal}>Deal</button>

      <Result />
    </>
  );
};

function App() {
  return (
    <>
      <h1>BlackJack</h1>
      <Game />
    </>
  );
}

export default App;
