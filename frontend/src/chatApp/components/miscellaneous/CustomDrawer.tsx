import { useRef, useEffect } from "react";
import { ChatState } from "../../context/ChatProvider";
import SkeletonLoader from "../miscellaneous/SkeletonLoader";
import UserListItem from "../UserAvatar/UserListItem";
import axios from "axios";
import ChatLoading from "./ChatLoading";

const CustomDrawer = ({
  isOpen,
  onClose,
  setSearch,
  search,
  handleSearch,
  loading,
  searchResult,
  setLoading,
  setSearchResult,
}) => {
  const drawerRef = useRef();
  const { user, chats, setSelectedChat } = ChatState();
  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const accessChat = async (userId: any) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "http://localhost:5001/api/chat",
        { userId },
        config
      );

      if (chats.find((c) => c._id === data._id)) {
        // setSelectedChat([...data, chats])
        setSelectedChat(data);
      } else {
        setSelectedChat(data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("accessChat Error", error);
    }
  };

  const onCloseClick = () => {
    setSearch("");
    // setSelectedChat([]);
    onClose();
    setSearchResult([]);
  };

  return (
    <div className={`drawer-backdrop ${isOpen ? "open" : ""}`}>
      <div className="drawer" ref={drawerRef}>
        <button className="close-button" onClick={onCloseClick}>
          &times;
        </button>
        <h2 className="search-title">Search Name</h2>
        <input
          value={search}
          type="text"
          placeholder="Search user..."
          className="search-input"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="go-button" onClick={handleSearch}>
          Go
        </button>
        {isOpen && loading ? (
          <SkeletonLoader />
        ) : (
          searchResult.map((user) => (
            <UserListItem
              key={user._id}
              user={user}
              handleFunction={() => accessChat(user._id)}
            />
          ))
        )}
        {loading && <ChatLoading></ChatLoading>}
      </div>
    </div>
  );
};

export default CustomDrawer;
