import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MessageContainer from "./components/MessageContainer";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsSidebarVisible(false); 
  };

  const handleShowSidebar = () => {
    setIsSidebarVisible(true);
    setSelectedUser(null);
  };

  return (
    
    <div className="h-screen w-full bg-slate-50 flex items-center justify-center p-0 md:p-6 lg:p-10 transition-all duration-300">
      
     
      <div className="flex w-full h-full max-w-[1440px] bg-white rounded-none md:rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100">
        
        {/* Sidebar Section */}
        <div 
          className={`
            ${isSidebarVisible ? 'flex' : 'hidden md:flex'} 
            w-full md:w-[350px] lg:w-[400px] flex-col bg-gray-50/50 border-r border-gray-100 transition-all duration-300
          `}
        >
          <Sidebar onSelectUser={handleUserSelect} />
        </div>

        

        {/* Message Section */}
        <div 
          className={`
            ${selectedUser ? 'flex' : 'hidden md:flex'} 
            flex-1 flex-col bg-white relative
          `}
        >
          {selectedUser ? (
            <MessageContainer onBackUser={handleShowSidebar} />
          ) : (
            // Welcome Screen when no user is selected
            <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-10">
              <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mb-6 animate-bounce">
                <span className="text-4xl">👋</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Select a conversation</h2>
              <p className="text-gray-500 mt-2 max-w-xs">
                Pick a friend from the sidebar to start chatting on ChatterBox.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

