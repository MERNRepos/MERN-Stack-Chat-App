import { Provider } from "./chatApp/components/ui/provider";
import ChatProvider from "./chatApp/context/ChatProvider";
import { ToastProvider } from "./chatApp/context/ToastContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./chatApp/pages/HomePage";
import ChatPage from "./chatApp/pages/ChatPage";

const App = () => {
  return (
    <div className="App">
      <Router>
        <ToastProvider>
          <ChatProvider>
            <Provider>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/chats" element={<ChatPage />} />
              </Routes>
            </Provider>
          </ChatProvider>
        </ToastProvider>
      </Router>
    </div>
  );
};

export default App;
