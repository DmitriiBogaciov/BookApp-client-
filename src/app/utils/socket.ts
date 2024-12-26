import { io } from 'socket.io-client';

const socket = io(`${process.env.NEXT_PUBLIC_BAOBOOX_API_HTTP}`, {
    transports: ['websocket'], // Используем WebSocket
    reconnection: true,       // Включаем автоматическое переподключение
});

export default socket;
