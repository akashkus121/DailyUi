import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext<any>(null);

function UserProvider({ children }: any) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser(); // ✅ CALL THE FUNCTION
  }, []); // ✅ dependency array

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
export default UserProvider;