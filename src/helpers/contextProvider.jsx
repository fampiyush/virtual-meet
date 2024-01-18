import React, { createContext, useState } from 'react';

// Create a new context
const PlayerContext = createContext([]);

// Create a provider component
const ContextProvider = ({ children }) => {
    const [playerKeys, setPlayerKeys] = useState([]);
    const [myName, setMyName] = useState('');

    return (
        <PlayerContext.Provider value={{ playerKeys, setPlayerKeys, myName, setMyName }}>
            {children}
        </PlayerContext.Provider>
    );
};

export { ContextProvider, PlayerContext };
