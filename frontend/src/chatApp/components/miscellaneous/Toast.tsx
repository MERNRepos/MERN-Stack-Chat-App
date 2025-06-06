

const Toast = ({ message, onClose, type }) => {
  return (
    <div className={`toast ${type}`}>
      <span>{message}</span>
      <button onClick={onClose} className="toast-close">✖</button>
    </div>
  );
};

export default Toast;
