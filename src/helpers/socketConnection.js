import { io } from "socket.io-client";
import { Peer } from "peerjs"

export const connectSocket = () => {
    const socket = io("http://localhost:3000");
    const peer = new Peer();

    const promise = new Promise((resolve) => {
        socket.on("connect", () => {
            resolve({ socket, peer });
        });
    });

    return promise;
}

export const sendModel = (socket, model) => {
    socket.emit('user-model', model)
}

export const receiveModel = (socket) => {
    socket.on('user-model', (model) => {
        console.log(model)
    })
}

export const getAllModels = (socket) => {
    socket.on('get-all-users', (models) => {
        return models
    })
}