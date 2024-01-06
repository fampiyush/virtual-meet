import React, { createContext, useState } from 'react';

// Create a new context
const PlayerContext = createContext("");

// Create a provider component
const ContextProvider = ({ children }) => {
    const [playerKeys, setPlayerKeys] = useState(null)

    return (
        <PlayerContext.Provider value={[ playerKeys, setPlayerKeys ]}>
            {children}
        </PlayerContext.Provider>
    );
};

export { ContextProvider, PlayerContext };
