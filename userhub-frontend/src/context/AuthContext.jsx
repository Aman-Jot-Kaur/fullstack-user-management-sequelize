// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    accessToken: null
  });

  const [loading, setLoading] = useState(true); // NEW

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (storedUser && storedAccessToken) {
      setAuth({
        user: JSON.parse(storedUser),
        accessToken: storedAccessToken,
        refreshToken: storedRefreshToken,
      });
    }
console.log(auth)
    setLoading(false); // After reading from localStorage
  }, []);

  const login = (user, accessToken, refreshToken ) => {
      console.log('LOGIN CALLED FROM CONTEXT');

    setAuth({ user, accessToken, refreshToken });

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken',refreshToken)
  };

 const logout = () => {
  setAuth({ user: null, accessToken: null, refreshToken: null });
localStorage.clear();
console.log("logged out")
};


  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
