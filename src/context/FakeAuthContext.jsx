import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

/* console.log("AuthContext", AuthContext); */

const initialState = {
  user: null,
  isAuthenticated: false,
};

function reducer(state, action) {
  if (action.type === "login") {
    return {
      ...state,
      user: action.payload,
      isAuthenticated: true,
    };
  }

  if (action.type === "logout") {
    return {
      ...state,
      user: null,
      isAuthenticated: false,
    };
  }

  throw new Error("Unknown action type");
}

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "login", payload: FAKE_USER });
    }

    throw new Error("The user is not existed");
  }

  function logout() {
    dispatch({ type: "logout" });
  }
  return (
    <AuthProvider.Provider
      value={{
        user,
        isAuthenticated,
        dispatch,
        login,
        logout,
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
