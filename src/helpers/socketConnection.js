import { io } from "socket.io-client";
import { Peer } from "peerjs"

export const connectSocket = (room) => {
    // const socket = io("https://virtual-backend-test.onrender.com/");
    const socket = io("http://localhost:3000/");
    const peer = new Peer();

    const promise = new Promise((resolve) => {
        socket.on("connect", () => {
            socket.emit('join', room)
            socket.on('joined-room', (room) => {
                if(room){
                    resolve({ socket, peer, room });
                }else {
                    resolve(room)
                }
            })
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