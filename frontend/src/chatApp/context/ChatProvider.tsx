import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Define the context type
interface ChatContextType {
  user: any; // Replace 'any' with your actual user type
  setUser: React.Dispatch<React.SetStateAction<any>>;
  selectedChat: any;
  setSelectedChat: React.Dispatch<React.SetStateAction<any>>;
  chats: any;
  setChats: React.Dispatch<React.SetStateAction<any>>;
  notification: [];
  setNotification: React.Dispatch<React.SetStateAction<any>>;
}

// Provide a default value
const ChatContext = createContext<ChatContextType>({
  user: null,
  setUser: () => {},
  selectedChat: null,
  setSelectedChat: () => {},
  chats: null,
  setChats: () => {},
  notification: [],
  setNotification: () => {},
});

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [selectedChat, setSelectedChat] = useState([]);
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
    setUser(userInfo);
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => useContext(ChatContext);
export default ChatProvider;
