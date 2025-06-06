import { useState } from "react";
import { Tooltip } from "../ui/tooltip";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { ChatState } from "../../context/ChatProvider";
import { profilePic } from "../../constants/constants";
import { FaBell, FaChevronDown, FaUserCircle } from "react-icons/fa";
import { Box, Button, Text, Menu, Portal, Icon } from "@chakra-ui/react";
import ProfileModal from "./ProfileModal";
import CustomDrawer from "../miscellaneous/CustomDrawer";
import axios from "axios";
import { UserProfileModel } from "../../components/miscellaneous/UserProfielModel";
import MenuPopup from "./MenuPopup";

const SideDrawer = () => {
  const navigate = useNavigate();
  const { user } = ChatState();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { showToast } = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      showToast("Please enter something in search", "error");
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
      console.log("Data===>", data);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      console.log("handleSearch Error", error);
      showToast("Error occured in search", "error");
    }
  };

  const onClose = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        background={"white"}
        width={"100%"}
        borderWidth={"5px"}
        p={"5px 10px 5px 10px"}
      >
        <Tooltip content="This is the tooltip content">
          <Button variant={"ghost"} onClick={() => setDrawerOpen(true)}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text
          fontSize="2xl"
          fontFamily="Work sans"
          color="purple.500"
          textShadow="1px 1px #000"
        >
          Talk-A-Tive
        </Text>

        <MenuPopup setModalOpen={setModalOpen} logoutHandler={logoutHandler} />
      </Box>

      <ProfileModal isOpen={isModalOpen} onClose={onClose}>
        <UserProfileModel user={user} profilePic={profilePic} />
      </ProfileModal>
      <CustomDrawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
        loading={loading}
        setLoading={setLoading}
        searchResult={searchResult}
        loadingChat={loadingChat}
        setSearchResult={setSearchResult}
      />
    </div>
  );
};

export default SideDrawer;
