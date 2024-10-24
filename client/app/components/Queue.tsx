"use client";
import { useState ,useEffect} from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {  useRecoilState } from "recoil";
import { cardState } from "../store/state";

export const Queue=()=>{

  const [selectedRoomSize, setSelectedRoomSize] = useState(3);
  const [status, setStatus] = useState("");
  const [roomData, setRoomData] = useState({
    roomId: "",
    players: [""],
    leaderId: "",
    playerId: "",
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [socket, setSocket] = useState<any>(null);
  const [dis,setDis]=useState(true)
  const [card, setCard] = useRecoilState(cardState);

  useEffect(() => {
    const socketConnection = io("http://localhost:3000");
    
    socketConnection.on("connect", () => {
      console.log("Connected to server!");
      setStatus("Connected to server!");
    });

    socketConnection.on("room-joined", (data: { roomId: string; players: string[]; leaderId: string; playerId: string }) => {
      console.log("Joined room:", data.roomId);
      setRoomData(data);
      setStatus(`Joined room: ${data.roomId}`);
    });

    socketConnection.on("disconnect", () => {
      console.log("Disconnected from server.");
      setStatus("Disconnected from server.");
    });

    socketConnection.on("leader-joined", (data: { roomId: string; leaderId: string }) => {
      console.log("Leader joined room:", data.roomId);
      setStatus(`Leader joined room: ${data.leaderId}`);
    });

    socketConnection.on("cardsDistributed", (cards: number[]) => {
      console.log("Received my cards from queue", cards);
      setCard(cards);
      setDis(false)
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

    

  const handleJoinQueue = () => {
    console.log("Joining queue for room size:", selectedRoomSize);
    setStatus("Waiting to join a room...");
    socket.emit("join-queue", selectedRoomSize);
  };

  const distCards = async () => {
    try {
      const data = {
        roomId: roomData.roomId,
        roomSize: selectedRoomSize,
      };

      const response = await axios.post("http://localhost:3000/getCards", data);

      if (response && response.data) {
        console.log("Distributed Cards:", response.data);
        setDis(false)
      } else {
        console.log("No data received");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isLeader = () => {
    if(!roomData) return false;
    return roomData.leaderId === roomData.playerId;
  };

  return(
    <div>
      {dis && (
        <div>
          <label htmlFor="roomSize">Select Room Size:</label>
          <select id="roomSize" value={selectedRoomSize} onChange={(e) => setSelectedRoomSize(Number(e.target.value))}>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
          </select>
          <button onClick={handleJoinQueue}>Join Queue</button>
          <p>{status}</p>
          </div>
        )
      }

      {isLeader() && dis && (
        <div>
          <button onClick={distCards}>Distribute Cards</button>
        </div>
      )}

      {!dis && (
        <div>
          <p>Cards Distributed</p>
        </div>
      )}

    </div>
  )
}
