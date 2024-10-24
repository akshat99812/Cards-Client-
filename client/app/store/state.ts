// src/state/state.js
import { atom } from 'recoil';


export const cardState = atom({
  key: 'cardState', 
  default: [] as number[], 
});