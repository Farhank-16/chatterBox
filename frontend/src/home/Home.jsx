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
     <div className="flex justify-between min-w-full 
           md:min-w-[550px] md:max-w-[65%] px-2 h-[95%] 
           md:h-full rounded-xl shadow-lg  
           bg-clip-padding bg-white/10 backdrop-blur-md"> 
      <div className={`w-full py-2 md:flex ${isSidebarVisible ? '' : 'hidden'}`} > 
            
          <Sidebar onSelectUser={handleUserSelect} /> 
      </div> 

      <div className={`w-1 bg-gradient-to-b from-sky-200 via-sky-500 to-sky-800 mx-2 md:flex ${isSidebarVisible ? '' : 'hidden md:flex'} ${selectedUser ? 'block' : 'hidden'}`} >
      </div>

      <div className={`flex-auto rounded-2xl mt-2 bg-white/0 backdrop-blur-md
        mb-2 ${selectedUser ? '' : 'hidden md:flex'} bg-gray-200`}>
       <MessageContainer onBackUser={handleShowSidebar} /> 

      </div> 
</div>

      );
    };     
     
    export default Home;