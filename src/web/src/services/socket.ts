import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SERVER_URL);
console.log('connected');

export default socket;
