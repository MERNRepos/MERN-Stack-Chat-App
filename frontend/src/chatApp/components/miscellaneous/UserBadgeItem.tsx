import { useState } from "react";

const UserTag = ({ user, onRemove }) => (
  <div className="user-tag">
    {user.name}
    <span className="close-icon" onClick={() => onRemove(user._id)}>
      ×
    </span>
  </div>
);

const UserBadgeItem = ({ selectedUsers, handleRemove }) => {
  return (
    <div className="user-tag-list">
      {selectedUsers.map((user) => (
        <UserTag key={user._id} user={user} onRemove={handleRemove} />
      ))}
    </div>
  );
};

export default UserBadgeItem;
