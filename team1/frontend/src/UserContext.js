// UserContext.js
import React, {createContext, useContext, useState} from 'react';

const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <UserContext.Provider value={{selectedUser, setSelectedUser}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
