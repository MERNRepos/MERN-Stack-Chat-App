# 💬 MERN Stack Chat App with Socket.IO

A real-time chat application built using the **MERN** stack (MongoDB, Express, React, Node.js) and **Socket.IO**. This app enables live messaging, typing indicators, and user presence updates with an elegant frontend and scalable backend.

## 🎬 Live Demo

![Chat Demo](./frontend/public/MERN_Stack_Chat_App.gif)

## 🚀 Features

- ⚡ Real-time messaging with Socket.IO
- 🔐 User authentication (JWT or session-based)
- 🧑‍🤝‍🧑 One-on-one and group chat support
- 🟢 Online/offline user status indicators
- 💬 Typing indicators and live message updates
- 🧩 Modular backend API and controller structure
- 🖼️ Responsive React frontend with reusable components

## 🛠 Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React, Socket.IO-client, Axios      |
| Backend  | Node.js, Express, Socket.IO         |
| Database | MongoDB + Mongoose                  |
| Auth     | JSON Web Tokens (JWT)               |
| Styling  | Tailwind CSS / Bootstrap (optional) |

## 📁 Folder Structure

mern-chat-app/
├── frontend/ # React frontend
│ ├── src/
│ │ ├── components/ # UI Components
│ │ ├── pages/ # Screens (Login, Chat)
│ │ ├── App.js # Main app
│ │ └── socket.js # Socket.IO client setup
├── server/ # Express backend
│ ├── controllers/ # Business logic
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API routes
│ ├── socket/ # Socket.IO config
│ ├── config/ # Database connection
│ └── server.js # Entry point
├── media/ # GIFs and screenshots
└── README.md

## 🧑‍💻 Getting Started

```bash
# Clone the repository
git clone https://github.com/MERNRepos/MERN-Stack-Chat-App.git
cd MERN-Stack-Chat-App

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Create environment variables
cd ../server
touch .env

```

🛡 License
This project is licensed under the MIT License.
Feel free to use, modify, and share it!
