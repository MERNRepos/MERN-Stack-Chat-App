import { useEffect, useState } from "react";
import { getSender, getSenderFull } from "../../config/chatLogics";
import { ChatState } from "../../context/ChatProvider";
import { IoArrowBack } from "react-icons/io5";
import { useToast } from "../../context/ToastContext";
import { UserProfileModel } from "../miscellaneous/UserProfielModel";
import { profilePic, END_POINT as ENDPOINT } from "../../constants/constants";
import axios from "axios";
import io from "socket.io-client";
import Lottie from "react-lottie";
import ScrollableChat from "./ScrollableChat";
import ProfileModal from "../miscellaneous/ProfileModal";
import animationData from "../../animations/typing.json";
import UpdateGroupChatModal from "../miscellaneous/UpdateGroupChatModal";

var socket, selectedChatCompare;

const SingleChat = ({
  fetchAgain,
  setFetchAgain,
  setIsModelOpen,
  isModalOpen,
}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:5001/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast("Error Occured!", "error");
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "http://localhost:5001/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast("Error Occured!", "error");
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat._id ? (
        <>
          <div className="chat-header">
            <button
              className="bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition"
              onClick={() => setSelectedChat("")}
            >
              <IoArrowBack size={20} className="text-gray-600" />
            </button>
            <h2 className="search-title">
              {!selectedChat.isGroupChat
                ? getSender(user, selectedChat.users)
                : selectedChat.chatName.toUpperCase()}
            </h2>
            <button className="eye-button" onClick={() => setIsModelOpen(true)}>
              👁️
            </button>

            {!selectedChat.isGroupChat ? (
              <ProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModelOpen(false)}
              >
                <UserProfileModel
                  user={getSenderFull(user, selectedChat.users)}
                  profilePic={profilePic}
                />
              </ProfileModal>
            ) : (
              <UpdateGroupChatModal
                fetchMessages={fetchMessages}
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                isOpen={isModalOpen}
                setIsOpen={() => {
                  setIsModelOpen(false);
                }}
              />
            )}
          </div>
          <div className="chat-body">
            <ScrollableChat messages={messages} />
          </div>

          <div className="chat-footer">
            {istyping ? (
              <div>
                <Lottie
                  options={defaultOptions}
                  // height={50}
                  width={70}
                  style={{ marginBottom: 15, marginLeft: 0 }}
                />
              </div>
            ) : (
              <></>
            )}
            <input
              type="text"
              placeholder="Enter a message.."
              onKeyDown={sendMessage}
              value={newMessage}
              onChange={typingHandler}
            />
          </div>
        </>
      ) : (
        <h2 className="search-title">Click on a user to start chatting</h2>
      )}
    </>
  );
};

export default SingleChat;
