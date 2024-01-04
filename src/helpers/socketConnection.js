import { io } from "socket.io-client";

export const connectSocket = (e) => {
    const socket = io("http://localhost:3000");
    socket.on("connect", () => {
        console.log('connected')
    })
    return socket
}