import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
axios.defaults.baseURL = "https://api.spotify.com/v1/";
axios.defaults.headers["content-type"] = "application/json";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  const [token, setToken_] = useState(localStorage.getItem("token"));
  const [profile, setProfile_] = useState(localStorage.getItem("profile"));

  const setToken = (newToken) => {
    setToken_(newToken);
  };

  const setProfile = (newProfile) => {
    setProfile_(newProfile);
  };
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (profile) {
      localStorage.setItem("profile", JSON.stringify(profile));
    } else {
      localStorage.removeItem("profile");
    }
  }, [profile]);

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      profile,
      setProfile,
      axios,
    }),
    [token]
  );

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
