import { io } from "socket.io-client";

export const connectSocket = () => {
    const socket = io("http://localhost:3000");
    socket.on("connect", () => {
        console.log('connected')
    })
    return socket
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