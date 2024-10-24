// src/state/state.js
import { atom } from 'recoil';
import { Socket } from 'socket.io-client';


export const cardState = atom({
  key: 'cardState', 
  default: [] as number[], 
});

export const room = atom({
  key: 'room',
  default: {
    roomId: "",
    players: [""],
    leaderId: "",
    playerId: "",
  },
});

export const socketGlobal = atom<Socket | null>({
  key: 'socketGlobal',
  default: null,
})

export const lastPlayed = atom<number[] | undefined>({
  key: 'lastPlayed',
  default: undefined,
})