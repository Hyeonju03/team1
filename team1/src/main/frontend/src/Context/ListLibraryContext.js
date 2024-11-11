import React, { createContext, useContext, useState } from 'react';

const ListLibraryContext = createContext();

export const ListLibraryProvider = ({ children }) => {
    const [btnCtl, setBtnCtl] = useState(0);

    const value = {
        btnCtl,
        setBtnCtl,
    };

    return (
        <ListLibraryContext.Provider value={value}>
            {children}
        </ListLibraryContext.Provider>
    );
}
export const useListLibrary = () => {
    return useContext(ListLibraryContext);
};