import { useToast } from "../../context/ToastContext";
import axios from "axios";
import { useState } from "react";
import ProfileModal from "./ProfileModal";
import { UserProfileModel } from "./UserProfielModel";
import { profilePic } from "../../constants/constants";
import UserListItem from "../UserAvatar/UserListItem";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "./UserBadgeItem";
import SkeletonLoader from "./SkeletonLoader";
import ChatLoading from "./ChatLoading";

const UpdateGroupChatModal = ({
  fetchMessages,
  fetchAgain,
  setFetchAgain,
  isOpen,
  setIsOpen,
}) => {
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const { showToast } = useToast();
  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      handleResetData();
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5001/api/user?search=${search}`,
        config
      );
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      showToast("Error Occured!");
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5001/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      console.log(data._id);
      // setSelectedChat("");
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      showToast("Error Occured!", "error");
      console.log("handleRename error", error);

      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1)) {
      showToast("User Already in group!", "error");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      showToast("Only admins can add someone!", "error");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5001/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      showToast("Error Occured!", "error");
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleResetData = () => {
    setLoading(false);
    setSearchResult([]);
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1 !== user._id) {
      showToast("Only admins can remove someone!", "error");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5001/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1,
        },
        config
      );

      user1 === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      showToast("Error Occured!", "error");
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <ProfileModal isOpen={isOpen} onClose={setIsOpen}>
      <div className="modal-title">{selectedChat.chatName}</div>
      <UserBadgeItem
        selectedUsers={selectedChat.users}
        handleRemove={handleRemove}
      />
      {selectedChat.users == 0 && loading ? (
        <div>Loading</div>
      ) : (
        <>
          <div className="modal-container">
            <input
              value={groupChatName}
              type="text"
              placeholder="Chat Name"
              className="search-input"
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <button className="go-button" onClick={handleRename}>
              Update
            </button>
            <input
              value={search}
              type="text"
              placeholder="Add Users eg: John, Piyush, Jane"
              className="group-search-input"
              onChange={(e) => handleSearch(e.target.value)}
            />
            {isOpen && loading ? (
              <SkeletonLoader />
            ) : (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user._id)}
                />
              ))
            )}
            {loading && <ChatLoading></ChatLoading>}

            <button
              className="create-chat-button"
              onClick={() => handleRemove(user._id)}
            >
              Leave Group
            </button>
          </div>
        </>
      )}
    </ProfileModal>
  );
};

export default UpdateGroupChatModal;
