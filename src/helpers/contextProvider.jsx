import React, { createContext, useState } from 'react';

// Create a new context
const PlayerContext = createContext([]);

// Create a provider component
const ContextProvider = ({ children }) => {
    const [playerKeys, setPlayerKeys] = useState([]);
    const [myName, setMyName] = useState('');
    const [peerConn, setPeerConn] = useState([]);

    return (
        <PlayerContext.Provider value={{ playerKeys, setPlayerKeys, myName, setMyName, peerConn, setPeerConn }}>
            {children}
        </PlayerContext.Provider>
    );
};

export { ContextProvider, PlayerContext };
