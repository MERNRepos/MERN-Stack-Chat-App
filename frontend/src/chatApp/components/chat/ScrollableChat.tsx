import { useEffect, useRef } from "react";
import { isLastMessage, isSameSender } from "../../config/chatLogics";
import { ChatState } from "../../context/ChatProvider";
import { Tooltip } from "../ui/tooltip";
import { profilePic } from "../../constants/constants";

const ScrollableChat = ({ messages }) => {
  const messagesEndRef = useRef(null);
  const { user } = ChatState();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      {messages.map((message, index) => (
        <div
          key={index}
          className="chat-container"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <div
            className={`message ${
              isSameSender(messages, message, index, user._id) ||
              isLastMessage(messages, index, user._id)
                ? "right"
                : "left"
            }`}
          >
            <div className="input-container">
              <Tooltip content={message.sender.name}>
                <img
                  className="avatar-placeholder"
                  src={message.pic == undefined ? profilePic : message.pic}
                />
              </Tooltip>
              <div
                className={`${
                  isSameSender(messages, message, index, user._id) ||
                  isLastMessage(messages, index, user._id)
                    ? "message-text-left"
                    : "message-text-right"
                }`}
              >
                {message.content}
              </div>
            </div>
          </div>
          <div ref={messagesEndRef} />
        </div>
      ))}
    </>
  );
};

export default ScrollableChat;
