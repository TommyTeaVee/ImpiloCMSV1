import { createContext, useContext } from "react";

export const InitialDataContext = createContext({});

export const useInitialData = (key) => useContext(InitialDataContext)[key];