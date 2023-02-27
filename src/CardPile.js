import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card";

const CardPile = () => {
  const [cards, setCards] = useState([]);
  const [deckId, setDeckId] = useState(null);

  useEffect(() => {
    const shuffleDeck = async () => {
      try {
        const response = await axios.get(
          "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
        );
        setDeckId(response.data.deck_id);
      } catch (error) {
        console.error(error);
      }
    };
    shuffleDeck();
  }, []);

  const drawCard = async () => {
    try {
      const response = await axios.get(
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
      );
      const card = response.data.cards[0];
      setCards((prevCards) => [
        ...prevCards,
        { suit: card.suit, value: card.value },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {deckId ? (
        <>
          <button onClick={drawCard} disabled={cards.length === 52}>Draw a card!</button>
          {cards.length > 0 ? (
            cards.map(({ suit, value }) => <Card suit={suit} value={value} />)
          ) : (
            <p>No cards drawn yet.</p>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
      {cards.length === 52 && <p>No more cards left.</p>}
    </div>
  );
};

export default CardPile;
