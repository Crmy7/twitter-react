import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import Cookies from "js-cookie";

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    setTokenState(Cookies.get("token") || null);
  }, []);

  const setToken = (token: string | null) => {
    if (token) {
      Cookies.set("token", token);
    } else {
      Cookies.remove("token");
    }
    setTokenState(token);
  };

  const getToken = () => Cookies.get("token") || null;

  return (
    <AuthContext.Provider value={{ token, setToken, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
