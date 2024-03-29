import { createContext, useState, useRef } from "react";

// Create a new context
const PlayerContext = createContext([]);

// Create a provider component
const ContextProvider = ({ children }) => {
  const [playerKeys, setPlayerKeys] = useState([]);
  const [myName, setMyName] = useState("");
  const [peerConn, setPeerConn] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [controlsAllowed, setControlsAllowed] = useState(true);
  const [screenShared, setScreenShared] = useState(false);
  const [device, setDevice] = useState({ audio: '', video: ''});

  const socket = useRef(null);
  const peer = useRef(null);
  const room = useRef(null);
  const pointerLockControls = useRef(null);

  return (
    <PlayerContext.Provider
      value={{
        playerKeys,
        setPlayerKeys,
        myName,
        setMyName,
        peerConn,
        setPeerConn,
        socket,
        peer,
        room,
        isAdmin,
        setIsAdmin,
        controlsAllowed,
        setControlsAllowed,
        setScreenShared,
        screenShared,
        pointerLockControls,
        device,
        setDevice
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export { ContextProvider, PlayerContext };
