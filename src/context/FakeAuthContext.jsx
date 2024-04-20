import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const initialState = {
  user: {},
};

function reducer(state, action) {}

function AuthProvider({ children }) {
  const [{ user }, dispatch] = useReducer(reducer, initialState);
  return (
    <AuthProvider.Provider
      value={{
        user,
        dispatch,
      }}
    >
      {children}
    </AuthProvider.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("Context is used outside AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
