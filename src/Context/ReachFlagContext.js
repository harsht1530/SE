// src/Context/ReachFlagContext.js
import React, { createContext, useState, useContext } from "react";

const ReachFlagContext = createContext();

export const ReachFlagProvider = ({ children }) => {
  const [reachFlag, setReachFlag] = useState("Local");
  return (
    <ReachFlagContext.Provider value={{ reachFlag, setReachFlag }}>
      {children}
    </ReachFlagContext.Provider>
  );
};

export const useReachFlag = () => useContext(ReachFlagContext);
