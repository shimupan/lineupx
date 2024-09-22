import { io } from 'socket.io-client';

const socket = io('http://localhost:1337'); 

export default socket;