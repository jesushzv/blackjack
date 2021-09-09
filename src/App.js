import React, { useState, useEffect, useRef } from "react";

const Game = () => {
  //Constants, variables and references (a fucking mess)

  const [active_game, setActive_game] = useState(false);
  const active_game_ref = useRef();
  active_game_ref.current = active_game;

  const [finished_game, setFinished_game] = useState(false);
  const finished_game_ref = useRef();
  finished_game_ref.current = finished_game;

  const [dealerCount, setDealerCount] = useState(0);
  const dealer_count_ref = useRef();
  dealer_count_ref.current = dealerCount;

  const [dealerCards, setDealerCards] = useState([]);

  const [playerCards, setPlayerCards] = useState([]);

  const [showResult, setShowResult] = useState(false);

  const [playerCount, setPlayerCount] = useState(0);

  let stay_btn_ref = useRef();
  let hit_btn_ref = useRef();
  let deal_btn_ref = useRef();

  //How can I handle the ace?
  let cards = {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    J: 10,
    Q: 10,
    K: 10,
  };


  //Draw a card
  const drawCard = () => {
    var keys = Object.keys(cards);
    var chosen = keys[Math.floor(Math.random() * keys.length)];

    var kinds = ["C", "D", "H", "S"];
    var kind_chosen = kinds[Math.floor(Math.random() * kinds.length)];

    return [`/cards/${chosen}${kind_chosen}.png`, cards[chosen]];
  };

  //Functional component of the player's cards
  const PlayerCards = (props) => {
    var urls = props.cards;
    return urls.map((e) => <img src={e} width="50" heigh="50" />);
  };

  //Functional component of the dealer's cards
  const DealerCards = (props) => {
    var urls = props.cards;
    return urls.map((e) => <img src={e} width="50" heigh="50" />);
  };

  //Handles when the player chooses to stay
  const finish = async () => {
    if (active_game_ref.current && !finished_game_ref.current) {
      await setFinished_game(true);
      await stay_btn_ref.current.setAttribute("disabled", "disabled");
      await hit_btn_ref.current.setAttribute("disabled", "disabled");
    }

    if (finished_game_ref.current) {
      var [card, value] = drawCard();

      while(playerCards.includes(card) || dealerCards.includes(card)){
        [card,value] = drawCard()
      }

      setTimeout(async () => {
        await setDealerCards([...dealerCards, card]);
        setDealerCount(() => dealerCount + value);
      }, 750);
    }
  };

  //Function to run every time the dealer count changes
  useEffect(() => {
    if (finished_game_ref.current) {
      if (dealer_count_ref.current < 17 && active_game_ref.current) {
        finish();
      } else {
        setActive_game(false);
        setShowResult(true);
        deal_btn_ref.current.removeAttribute("disabled");
      }
    }
  }, [dealerCount]);

  //Handles when the player hits
  const playerHit = () => {
    if (active_game_ref.current) {
      var [card, value] = drawCard();

      while(playerCards.includes(card) || dealerCards.includes(card)){
        [card,value] = drawCard()
      }

      setPlayerCount((playerCount) => playerCount + value);
      setPlayerCards([...playerCards, card]);
    }
  };

  //Function to run every time the player's count changes
  useEffect(() => {
    if (playerCount > 21) {
      setActive_game(false);
      setFinished_game(true);
      setShowResult(true);
      stay_btn_ref.current.setAttribute("disabled", "disabled");
      hit_btn_ref.current.setAttribute("disabled", "disabled");
      deal_btn_ref.current.removeAttribute("disabled");
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
      return <></>;
    }
  };

  //Start the game
  const deal = () => {
    setActive_game(true);
    setFinished_game(false);
    setPlayerCount(0);
    setShowResult(false);
    stay_btn_ref.current.removeAttribute("disabled");
    hit_btn_ref.current.removeAttribute("disabled");
    deal_btn_ref.current.setAttribute("disabled", "disabled");

    var [card, value] = drawCard();
    setDealerCards([card]);
    setDealerCount(value);

    setPlayerCards([]);
  };

  return (
    <>
      <div className="dealer">
        <h1>Dealer</h1>
        <h2>{dealerCount}</h2>
        <div className="dealerCards">
          <DealerCards cards={dealerCards} />
        </div>
      </div>

      <div className="player">
        <h1>Player</h1>
        <h2>{playerCount}</h2>
        <div className="playerCards">
          <PlayerCards cards={playerCards} />
        </div>
      </div>

      <div className="buttons">
        <button ref={hit_btn_ref} onClick={playerHit}>
          Hit
        </button>
        <button ref={stay_btn_ref} onClick={finish}>
          Stay
        </button>
      </div>

      <button ref={deal_btn_ref} onClick={deal}>
        Deal
      </button>

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
