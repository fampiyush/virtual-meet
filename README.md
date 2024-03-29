# Virtual Meet

Try on our website - https://meet.piyushg.com

A virtual meeting environment using @react-three-fiber and threejs. The goal is to provide a realistic and immersive experience for participants.

![virtual-meet-img](/public/virtual-meet.png)


### Features

- 3D Environment: The meeting takes place in a fully interactive 3D environment, allowing participants to navigate and explore the virtual space.
- Real-time Communication: Participants can communicate with each other using voice chat, video or text chat, enabling seamless collaboration.
- Screen Sharing: Participants can share their screens with others, allowing for collaborative presentations and demonstrations.

**This project is still in development, so currently it is missing some features and is not compatible with mobile as of now.**

## Tech Stack
- ReactJS
- React-three-fiber, threejs
- PeerJS
- Socket.io
- TailwindCSS

## Controls
`W: Forward`<br>
`A: Left`<br>
`S: Backward`<br>
`D: Right`<br>
`Ctrl+Shift+Z: Mic`<br>
`Ctrl+Shift+X: Video`

## Getting Started

To create your own instance of virtual meeting, follow these steps:

1. Clone the repository: `git clone https://github.com/fampiyush/virtual-meet.git`
2. Install dependencies: `npm install`
3. Create a .env file and add the required env variables. please refer to the [env](#setting-up-env-file) section.

4. Start the development server: `npm run dev`
5. Open your web browser and navigate to `http://localhost:5173`

## Backend
Backend code is on a different repository. Head to the [Backend Repository](https://github.com/fampiyush/virtual-meet-backend.git)

## Setting up .env file
```
# Url of backend

VITE_BACKEND_URL=http://localhost:3000


# Note - Don't include the protocol in the VITE_PEER_HOST (http:// or https://)
# 0.peerjs.com is default peerjs server

VITE_PEER_HOST=0.peerjs.com


# Url of where it is hosted

VITE_BASE_URL=http://localhost:5173
```
For creating your own peer server, head over to [peerjs-server](https://github.com/peers/peerjs-server)

## Contributing

Contributions are welcome! If you have any ideas or improvements, please submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.