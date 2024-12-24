'use client';
import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client'

let socket: Socket;

export default function BlocksList(pageId: string){

    useEffect(() => {
        socket = io(`${process.env.NEXT_PUBLIC_BAOBOOX_API_HTTP}`, {query: { pageId }})

        const handleConnect = () => {
            console.log(`Connected to WebSocket server with bookId: ${pageId}`);
            socket.emit('get_blocks', { pageId }); // Запрашиваем плоский список страниц
        };

        socket.on('connect', handleConnect);
    })

}