import React, { useEffect, useState } from "react";

const NotificationBadge = React.forwardRef(({ count, ...rest }, ref) => {
  const [animate, setAnimate] = useState(false);
  const [prevCount, setPrevCount] = useState(count);

  useEffect(() => {
    if (count !== prevCount) {
      setAnimate(true);
      setPrevCount(count);
      const timeout = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [count, prevCount]);

  return (
    <div
      ref={ref}
      className="notification-container"
      {...rest} // spread props like onClick, etc.
    >
      <svg
        className="icon"
        height="24"
        width="24"
        viewBox="0 0 24 24"
        fill="gray"
      >
        <path d="M12 24c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6.36-6c-.28-.31-.36-.67-.36-1V11c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v6c0 .33-.08.69-.36 1L4 20h16l-1.64-2z" />
      </svg>
      {count > 0 && (
        <span className={`badge ${animate ? "pop" : ""}`}>{count}</span>
      )}
    </div>
  );
});

export default NotificationBadge;
