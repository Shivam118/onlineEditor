import React, { createContext, useState, useContext } from "react";

// Create a context for user information
const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    photo: "",
  }); // Set initial user state as needed

  // Function to set user information
  const loginUser = (userData) => {
    setUser({
      name: userData.displayName,
      email: userData.email,
      photo: userData.photoURL,
    });
  };

  // Function to log out user
  const logoutUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
