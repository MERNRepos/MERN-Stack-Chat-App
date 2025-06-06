import { FaBell, FaChevronDown, FaUserCircle } from "react-icons/fa";
import { Box, Button, Text, Menu, Portal, Icon } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import { getSender } from "../../config/chatLogics";
import NotificationBadge from "./NotificationBadge";

const MenuPopup = ({ setModalOpen, logoutHandler }) => {
  const { notification, user, setNotification, setSelectedChat } = ChatState();

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Menu.Root>
        <Menu.Trigger asChild>
          <NotificationBadge count={notification.length} />
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              {!notification.length && (
                <Menu.Item onClick={() => console.log("Bell item 1")}>
                  No new messages
                </Menu.Item>
              )}
              {notification.map((notif) => (
                <Menu.Item
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>

      {/* User icon (no menu) */}
      <Icon
        as={FaUserCircle}
        w={6}
        h={6}
        color="gray.600"
        fontSize="2xl"
        m={2}
      />

      {/* Chevron down menu */}
      <Menu.Root>
        <Menu.Trigger asChild>
          <Icon
            as={FaChevronDown}
            w={3}
            h={3}
            color="gray.600"
            fontSize="2xl"
            m={2}
            cursor="pointer"
          />
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="new-txt" onClick={() => setModalOpen(true)}>
                My profile
              </Menu.Item>
              <Menu.Item value="new-file" onClick={() => logoutHandler()}>
                Logout
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </div>
  );
};

export default MenuPopup;
