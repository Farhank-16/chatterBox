import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("chatapp")) || null
  );

  // ✅ Sync state with localStorage whenever authUser changes
  useEffect(() => {
    if (authUser) {
      localStorage.setItem("chatapp", JSON.stringify(authUser));
    } else {
      localStorage.removeItem("chatapp"); // agar logout kare to remove ho jaye
    }
  }, [authUser]);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
