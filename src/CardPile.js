import React, { useState, useEffect, useRef } from "react"
import axios from "axios";
import Card from "./Card"

const CardPile = () => {
    const [cards, setCards] = useState([]);
    const [drawing, setDrawing] = useState(false);
    const deckIdRef = useRef(null);
    const intervalIdRef = useRef(null);

    useEffect(() => {
        async function shuffleDeck() {
            const response = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
            deckIdRef.current = response.data.deck_id;
        }
        shuffleDeck();
    }, []);

    useEffect(() => {
        async function drawCard() {
            try {
                const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckIdRef.current}/draw/?count=1`);
                const card = response.data.cards[0];
                setCards(oldCards => [...oldCards, card]);
                if (response.data.remaining === 0) {
                    setDrawing(false);
                }
            } catch (error) {
                console.error(error);
            }
        }

        if (drawing && deckIdRef.current) {
            intervalIdRef.current = setInterval(() => {
                drawCard();
            }, 1000);
        }

        return () => {
            clearInterval(intervalIdRef.current);
        };
    }, [drawing]);

    const handleDrawClick = () => {
        setDrawing(oldDrawing => !oldDrawing);
    };

    return (
        <div>
            <button onClick={handleDrawClick} disabled={cards.length === 52}>{drawing ? "Stop drawing" : "Start drawing"}</button>
            {cards.map(({suit, value}) => <Card suit={suit} value={value} />)}
        </div>
    )
}

export default CardPile
