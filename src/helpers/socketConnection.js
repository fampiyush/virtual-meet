import { io } from "socket.io-client";

export const connectSocket = (room) => {
    const socket = io(import.meta.env.VITE_BACKEND_URL);

    const promise = new Promise((resolve) => {
        socket.on("connect", () => {
            socket.emit('join', room)
            socket.on('joined-room', (room) => {
                resolve({socket, room})
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