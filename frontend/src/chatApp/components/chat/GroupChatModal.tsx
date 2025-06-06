import { useState, useEffect } from "react";
import { ChatState } from "../../context/ChatProvider";
import { useToast } from "../../context/ToastContext";
import axios from "axios";
import ChatLoading from "../miscellaneous/ChatLoading";
import { getSender } from "../../config/chatLogics";
import ProfileModal from "../miscellaneous/ProfileModal";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../miscellaneous/UserBadgeItem";

const GroupChatModal = ({ showGroupChatModal, onCloseGroupChatModal }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, setUser, selectedChat, chats, setChats } = ChatState();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [groupChatName, setGroupChatName] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
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
      console.log("handleSearch Data", data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.log("handleSearch Error", error);

      showToast("Failed to Load the Search Results", "error");
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      showToast("User already added", "error");
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      showToast("Please fill all the feilds", "error");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios
        .post(
          "http://localhost:5001/api/chat/group",
          {
            name: groupChatName,
            users: selectedUsers.map((u) => u._id),
          },
          config
        )
        .catch((error) => {
          console.log("create Group error", error);
        });
      setChats([data, ...chats]);
      resetData();
      showToast("New Group Chat Created!", "error");
    } catch (error) {
      showToast("Failed to Create the Chat!", "error");
    }
  };

  const resetData = () => {
    setSearch("");
    setSelectedUsers([]);
    setSearchResult([]);
    setGroupChatName("");
    setLoading(false);
    onCloseGroupChatModal();
  };

  const handleRemove = (_id) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== _id));
  };

  return (
    <ProfileModal
      isOpen={showGroupChatModal}
      onClose={() => {
        resetData();
      }}
    >
      <div className="modal-container">
        <div className="title-header">Create Group Chat</div>
        <input
          value={groupChatName}
          type="text"
          placeholder="Chat Name"
          className="group-search-input"
          onChange={(e) => setGroupChatName(e.target.value)}
        />
        <input
          value={search}
          type="text"
          placeholder="Add Users eg: John, Piyush, Jane"
          className="group-search-input"
          onChange={(e) => handleSearch(e.target.value)}
        />
        {/* Selected Users */}
        <UserBadgeItem
          selectedUsers={selectedUsers}
          handleRemove={handleRemove}
        />
        {/* render searched Users */}
        {searchResult.length == 0 && loading ? (
          <div>Loading</div>
        ) : (
          searchResult.map((user) => (
            <UserListItem
              key={user._id}
              user={user}
              handleFunction={() => handleGroup(user)}
            />
          ))
        )}

        <button className="create-chat-button" onClick={handleSubmit}>
          Create Chat
        </button>
      </div>
    </ProfileModal>
  );
};

export default GroupChatModal;
