import { createContext, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Clear user data
  const clearUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
