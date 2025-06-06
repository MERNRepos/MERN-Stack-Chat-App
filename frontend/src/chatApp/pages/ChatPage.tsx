import { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/chat/MyChats";
import ChatBox from "../components/chat/ChatBox";

const ChatPage = () => {
  const { user } = ChatState();
  const [loadingChat, setLoadingChat] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [isModalOpen, setIsModelOpen] = useState(false);

  const onPressNewGroupChat = async () => {};

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}

      <Box
        display="flex"
        width="100%"
        height="91.5vh"
        padding="10px"
        justifyContent="space-between"
      >
        {user && (
          <MyChats
            onPressNewGroupChat={onPressNewGroupChat}
            fetchAgain={fetchAgain}
            setIsModelOpen={setIsModelOpen}
            isModalOpen={isModalOpen}
          />
        )}
        {user && (
          <ChatBox
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
            setIsModelOpen={setIsModelOpen}
            isModalOpen={isModalOpen}
          />
        )}
      </Box>
      {/* {loadingChat && <ChatLoading></ChatLoading>} */}
    </div>
  );
};

export default ChatPage;
