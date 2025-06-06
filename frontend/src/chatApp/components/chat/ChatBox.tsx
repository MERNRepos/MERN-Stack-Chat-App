import SingleChat from "./SingleChat";

const ChatBox = ({
  fetchAgain,
  setFetchAgain,
  isModalOpen,
  setIsModelOpen,
}) => {
  return (
    <div className="chat-wrapper">
      <SingleChat
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
        setIsModelOpen={setIsModelOpen}
        isModalOpen={isModalOpen}
      />
    </div>
  );
};

export default ChatBox;
