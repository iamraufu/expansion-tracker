import React, { createContext } from 'react';
import useCredential from '../hooks/useCredential';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const allContexts = useCredential()

    return (
        <AuthContext.Provider value={allContexts}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
