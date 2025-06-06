const ProfileModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default ProfileModal;
