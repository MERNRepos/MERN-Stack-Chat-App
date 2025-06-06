import { useState, useEffect } from "react";
import { ChatState } from "../../context/ChatProvider";
import { useToast } from "../../context/ToastContext";
import { getSender } from "../../config/chatLogics";
import axios from "axios";
import ChatLoading from "../miscellaneous/ChatLoading";
import GroupChatModal from "../chat/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const { showToast } = useToast();
  const [showGroupChatModal, setShowGroupChatModal] = useState(false);

  const fetchChats = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const { data } = await axios.get(
        "http://localhost:5001/api/chat",
        config
      );

      setChats(data);
    } catch (error) {
      console.log("fetchChats Error", error);
      showToast("Failed to load chats", "error");
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <>
      {chats && loggedUser ? (
        <div className="chat-list-wrapper">
          <div className="chat-list-header">
            <h2>My Chats</h2>
            <button
              className="new-group-btn"
              onClick={() => setShowGroupChatModal(true)}
            >
              New Group Chat ➕
            </button>
          </div>

          <div className="chat-list-body">
            {chats.map((chat, index) => (
              <div
                className={`chat-card ${
                  selectedChat.id === chat.id ? "selected" : ""
                }`}
                key={index}
                onClick={() => {
                  setSelectedChat(chat);
                  // setIsModelOpen(true);
                }}
              >
                <div className="chat-name">
                  {chat.isGroupChat
                    ? chat.chatName
                    : getSender(loggedUser, chat.users)}
                </div>
                {/* <div className="chat-message">
                  <strong>{chat.sender}</strong>: {chat.message}
                </div> */}
              </div>
            ))}

            <GroupChatModal
              showGroupChatModal={showGroupChatModal}
              onCloseGroupChatModal={() => setShowGroupChatModal(false)}
            ></GroupChatModal>
          </div>
        </div>
      ) : (
        <ChatLoading />
      )}
    </>
  );
};

export default MyChats;
