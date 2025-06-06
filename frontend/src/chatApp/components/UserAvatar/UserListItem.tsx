import {profilePic} from '../../constants/constants';

const UserListItem = ({ user, handleFunction }) => {

  return (
    <div className="user-card" onClick={handleFunction}>
      <img className="avatar-placeholder" src={user.pic=='' ? profilePic : user.pic} />
      <div className="user-info">
        <div className="user-name">{user.name}</div>
        <div className="user-email"><strong>Email :</strong> {user.email}</div>
      </div>
    </div>
  )
}

export default UserListItem