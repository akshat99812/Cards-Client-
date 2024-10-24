import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import { cardState, room, socketGlobal , lastPlayed } from '../store/state';
import { io,Socket} from 'socket.io-client';

const GameTable = ({cards}) => {

    const [chosenCards,setChosenCards]=useState<number[]>([])
    const [card, setCard] = useRecoilState(cardState);
    const [count, setCount] = useState(0);
    const [chosenCard,setChosenCard]=useState<number|undefined>()
    const [roomData, setRoomData] = useRecoilState(room);
    const [socket, setSocket] = useState<any>(null);
    const [socketG, setSocketG] = useRecoilState<Socket | null>(socketGlobal);
    const [lastPlayedCard,setLastPlayed]=useRecoilState(lastPlayed)

    useEffect(() => {
        const socketConnection = io("http://localhost:3000");

        socketConnection.emit('joinRoom', roomData.roomId);

        console.log("control reached in lastPlayed part")

        socketConnection.on('lastPlayed', (data) => {
            setLastPlayed(data);
            console.log("lastPlayed",data)
        });    

        setSocket(socketConnection);

        return () => {
            socketConnection.disconnect();
        };

    }, []);

    const chooseCard=async (card:number|undefined) => {
        console.log(card)
        if(card!==undefined){
          setChosenCards([...chosenCards,card])  
        }
        
    }
    
    const playCards = async () => {
        if (chosenCards.length > 0) {
            setChosenCards([]);
            const newCards = cards.filter((index: number) => !chosenCards.includes(index));
            setCard(newCards);
            resetCards();
            setCount(count+1);

            const data = {
                roomId: roomData.roomId,
                player: roomData.playerId,
                card: chosenCards
            };
    
            // Emit the playCard event
            socket.emit('playCard', data);
            console.log("data that was emitted",data)
            
            socket.disconnect(); // Ensures proper cleanup
        
        } else {
            console.log("No cards selected to play");
        }
    }

    const skipturn=async () => {
    }
    const resetCards=async () => {
        setChosenCards([])
    }

    const showCards =()=>{

    }

    const resetChosenCards=() => {
        setChosenCards([])
    }

  return (
    <div>
      <div className='flex h-[500px]'>
        <div className='flex bg-red-500 w-3/4 '>
            <div className='bg-green-500 w-1/5'>
                <div className="my-10 bg-yellow-500">
                    <div>
                        Player 1
                    </div>
                    <div>
                        Player played This cards and this will dissapperar after 5 seconds
                    </div>
                </div>
                <div className="my-10 bg-yellow-500">
                    <div>
                        Player 3
                    </div>
                    <div>
                        Player played This cards and this will dissapperar after 5 seconds
                    </div>
                </div>
                <div className="my-10 bg-yellow-500">
                    <div>
                        Player 5
                    </div>
                    <div>
                        Player played This cards and this will dissapperar after 5 seconds
                    </div>
                </div>
            </div>
            <div className='bg-blue-500 w-3/5'>
                    {count}
            </div>
            <div className='bg-green-500 w-1/5'>
                <div className="my-10 bg-yellow-500">          
                    <div>
                        Player 2
                    </div>
                    <div>
                        Player played This cards and this will dissapperar after 5 seconds
                    </div>
                </div>
                <div className="my-10 bg-yellow-500">
                    <div>
                        Player 4
                    </div>
                    <div>
                        Player played This cards and this will dissapperar after 5 seconds
                    </div>
                </div>
                <div className="my-10 bg-yellow-500">
                    <div>
                        Player 6
                    </div>
                    <div>
                        Player played This cards and this will dissapperar after 5 seconds
                    </div>
                </div>
            </div>     
        </div>
        <div className='bg-pink-500 w-1/4 flex'>
            ChatRoom
        </div>
      </div>
      <div className='flex h-[200px]'>
      <div className='w-3/4 bg-purple-500 flex px-2'>
    {cards.map((card: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<React.AwaitedReactNode> | null | undefined, index: React.Key | null | undefined) => (
        <div 
            key={index} 
            className={`px-3 my-auto h-16 mx-2 ${chosenCards.includes(card) ? 'bg-green-500' : 'bg-red-500'}`} 
            onClick={() => chooseCard(card)}
                    >
                        {card}
                    </div>
                ))}
        </div>

        <div className='w-1/4 bg-yellow-500'>
            <div className='flex'>
                <div>
                   <button className='bg-green-500 px-4 py-4 my-4 w-full rounded-full' onClick={()=>playCards()}>
                        Play
                    </button> 
                </div>
                <div>
                   <button className='bg-green-500 px-4 py-4 my-4 w-full rounded-full' onClick={()=>resetCards()}>
                        Cancel
                    </button> 
                </div>
                <div>
                   <button className='bg-green-500 px-4 py-4 my-4 w-full rounded-full' onClick={()=>skipturn()}>
                        Skip
                    </button> 
                </div>
                <div>
                   <button className='bg-green-500 px-4 py-4 my-4 w-full rounded-full' onClick={()=>showCards()}>
                        Show
                    </button> 
                </div>
            </div>
        </div>
      </div>

    </div>
  )
}

export default GameTable
