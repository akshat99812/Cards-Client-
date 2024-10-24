"use client"
import { Queue } from "@/app/components/Queue";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useRecoilState } from "recoil";
import { cardState } from "../../store/state";
import GameTable from "@/app/components/GameTable";
import Navbar from "@/app/components/Navbar";

export default function Page() {

  const [socketConnection, setSocketConnection] = useState<any>(null);
  const [cards,setCards] = useState<Array<number>>([]);
  const [card, setCard] = useRecoilState(cardState);

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("Connected to server from page");
    });

    socket.on("cardsDistributed", (cards: number[]) => {
      console.log("Received my cards in page", cards);
      setCards(cards);
    });

    setSocketConnection(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(()=>{
    setCards(card)
  },[card])

  return (
    <div>
      <Navbar></Navbar>
      {cards.length <= 0 ? (
        <Queue ></Queue>
      ): (
        <div>
          hi from queue page
        </div>
      )
      }
      <GameTable cards={cards}></GameTable>
    </div>
  );
}