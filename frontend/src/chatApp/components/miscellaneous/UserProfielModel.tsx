export const UserProfileModel = ({ profilePic, user }) => {
  return (
    <div className="modal-container">
      <div className="modal-header">{user.name}</div>
      <img
        src={profilePic}
        // src={user.pic ?? profilePic}
        alt="Profile Placeholder"
        className="profile-image"
      />
      <p className="modal-email">Email:- {user.email}</p>
    </div>
  );
};
