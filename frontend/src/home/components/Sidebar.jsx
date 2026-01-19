import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiSearchAlt, BiArrowBack } from "react-icons/bi";
import { TbLogout2 } from "react-icons/tb";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useConversation from "../../Zustand/useConversation.js";
import { useSocketContext } from "../../context/socketContext.jsx";

const Sidebar = ({ onSelectUser }) => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { 
  chatUsers, 
  setChatUsers, 
  addOrMoveChatUser,
  setSelectedConversation , messages
} = useConversation();

  const [selectedUserId, setSelectedUserId] = useState(null);
  // const { messages, setSelectedConversation } = useConversation();
  const { onlineUser, socket } = useSocketContext();
  const [newMessageUsers, setNewMessageUsers] = useState("");

  const getAvatarURL = (path) => {
  if (!path) return "/default-avatar.png";
  if (path.startsWith("http") || path.startsWith("blob")) return path;
  return `http://localhost:3000${path}`;
};


  const isUserOnline = (userId) => onlineUser.includes(userId);

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setNewMessageUsers(newMessage);
    });
    return () => socket?.off("newMessage");
  }, [socket, messages]);

  useEffect(() => {
    const chatUserHandler = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/user/currentchatters");
        if (res.data.success !== false) setChatUsers(res.data);
      } catch (error) {
        console.log("Error fetching chat users:", error);
      } finally {
        setLoading(false);
      }
    };
    chatUserHandler();
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return toast.info("Enter a username");
    setLoading(true);
    try {
      const res = await axios.get(`/api/user/search?search=${searchInput}`);
      if (res.data.length === 0) toast.info("User Not Found");
      else setSearchUser(res.data);
    } catch (error) {
      toast.error("Failed to search user");
    } finally {
      setLoading(false);
    }
  };

 const handleUserClick = (user) => {
  onSelectUser(user);
  setSelectedConversation(user);
  setSelectedUserId(user._id);

  setNewMessageUsers("");
};


  const handleLogOut = async () => {
    const confirmLogout = window.prompt(`Type "${authUser.username}" to logout`);
    if (confirmLogout?.trim().toLowerCase() === authUser.username.toLowerCase()) {
      try {
        await axios.post("/api/auth/logout");
        localStorage.removeItem("chatapp");
        setAuthUser(null);
        navigate("/login");
      } catch (error) {
        toast.error("Logout failed");
      }
    }
  };

  const Avatar = ({ user }) => (
    <div className="relative flex-shrink-0" >
    <img
  src={getAvatarURL(user.profilepic)}
  alt="user"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "/default-avatar.png";
  }}
  className="h-12 w-12 rounded-2xl object-cover border border-gray-100 shadow-sm"
/>


      {isUserOnline(user._id) && (
        <span className="absolute -bottom-0.5 -right-0.5 block h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white"></span>
      )}
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col bg-gray-50/50">
      {/* --- Header Section --- */}
      <div className="p-4 bg-white border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">Messages</h2>
         <div className="flex items-center gap-2">
  {/* Username Badge */}
  <span className="px-3 py-1 bg-rose-50 text-rose-600 text-sm font-semibold rounded-full whitespace-nowrap">
    {authUser?.username}
  </span>

  {/* Avatar */}
  <img
    src={getAvatarURL(authUser?.profilepic)}
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = "/default-avatar.png";
    }}
    className="h-10 w-10 rounded-xl object-cover cursor-pointer hover:ring-2 hover:ring-rose-400"
    alt="Me"
  />
</div>


        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative group">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-rose-500/20 transition-all"
          />
          <BiSearchAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 text-lg transition-colors" />
        </form>
      </div>

      {/* --- List Section --- */}
      <div className="flex-1 overflow-y-auto px-2 py-3 custom-scrollbar">
        {searchUser?.length > 0 && (
          <button 
            onClick={() => { setSearchUser([]); setSearchInput(""); }}
            className="flex items-center gap-2 mb-4 ml-2 text-rose-600 text-sm font-bold hover:bg-rose-50 p-2 rounded-lg transition-colors"
          >
            <BiArrowBack /> Clear Search
          </button>
        )}

        <div className="space-y-1">
          {(searchUser.length > 0 ? searchUser : chatUsers).map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user)}
              className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 group ${
                selectedUserId === user._id
                  ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                  : "hover:bg-white hover:shadow-sm"
              }`}
            >
              <Avatar user={user} />
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className={`font-bold truncate ${selectedUserId === user._id ? "text-white" : "text-gray-800"}`}>
                    {user.username}
                  </p>
                  
                  {newMessageUsers.receiverId === authUser._id && newMessageUsers.senderId === user._id && (
                    <span className="flex-shrink-0 bg-green-500 text-[10px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-tighter animate-pulse">
                      New
                    </span>
                  )}
                </div>
                <p className={`text-xs truncate ${selectedUserId === user._id ? "text-rose-100" : "text-gray-400"}`}>
                  {isUserOnline(user._id) ? "Active now" : "Offline"}
                </p>
              </div>
            </div>
          ))}

          {chatUsers.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center mt-12 text-gray-400 space-y-2">
              <span className="text-3xl">☕</span>
              <p className="text-sm font-medium">Start a new conversation</p>
            </div>
          )}
        </div>
      </div>

      {/* --- Footer Section --- */}
      <div className="p-4 bg-white border-t border-gray-100">
        <button
          onClick={handleLogOut}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-semibold text-sm"
        >
          <TbLogout2 size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;