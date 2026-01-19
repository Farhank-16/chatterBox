Real-Time Chat Application (MERN Stack)
This is a modern, high-performance real-time chat application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack and Socket.io. It features a smooth UI, instant messaging, and several advanced features found in major social platforms.

✨ Features
Real-Time Messaging: Instant delivery of messages using Socket.io without needing to refresh the page.

User Presence: Real-time tracking of online/offline status with visual indicators (green dots).

Sound & Visual Notifications: iOS-style sound alerts for incoming messages and real-time toast notifications.

User Search: Ability to search for any registered user globally within the app to start a new conversation.

Intelligent Sorting: Conversations are automatically sorted by the most recent message; the latest chat always moves to the top.

Unread Message Badges: Shows "New" or numeric badges when a user receives a message while not actively in that chat.

Secure Authentication: Implementation of JWT (JSON Web Tokens) and BCrypt.js for secure password hashing and session management.

Safety Logout: A unique security feature where users must type their username to confirm logout, preventing accidental sessions ends.

Mobile-First Design: Fully responsive UI that works perfectly on mobile, tablet, and desktop devices.

🚀 Tech Stack
Frontend: React.js, Tailwind CSS, Zustand (State Management), React-Toastify.

Backend: Node.js, Express.js.

Database: MongoDB.

Real-Time Engine: Socket.io.

Security: JWT for Auth, BCrypt.js for encryption, Cookie-parser for session security.

🛠️ Installation & Setup
1. Clone the Repository
Bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
2. Backend Configuration
Navigate to the backend directory and install dependencies:

Bash
cd backend
npm install
Create a .env file in the backend root and add the following:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
Start the backend server:

npm run dev

3. Frontend Configuration
Navigate to the frontend directory and install dependencies:

cd frontend
npm install
Start the React application:

npm start

📂 Project Structure
Chatterbox
├── backend
│   ├── controllers/   # Request handling logic
│   ├── models/        # MongoDB schemas (User, Message, Conversation)
│   ├── routes/        # Express API endpoints
│   ├── socket/        # Socket.io configuration
│   └── server.js      # Main entry point
├── frontend
│   ├── src
│   │   ├── components/# UI Components (Sidebar, MessageContainer, etc.)
│   │   ├── context/   # Auth and Socket context providers
│   │   ├── hooks/     # Custom React hooks
│   │   └── Zustand/   # State management (useConversation.js)
└── package.json