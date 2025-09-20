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
  const [chatUser, setChatUser] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { messages , setMessage , selectedConversion , setSelectedConversation } = useConversation();
  const { onlineUser, socket } = useSocketContext();
  const [newMessageUsers, setNewMessageUsers] = useState("");


  // ✅ Online check
  const isUserOnline = (userId) => onlineUser.includes(userId);

  // ✅ Socket listener for new messages
  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
     setNewMessageUsers(newMessage)
    });

    return () => socket?.off("newMessage");
  }, [socket,messages]);

  // ✅ Fetch current chatters
  useEffect(() => {
    const chatUserHandler = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/user/currentchatters");
        const data = res.data;

        if (data.success === false) {
          console.log(data.message);
        } else {
          setChatUser(data);
        }
      } catch (error) {
        console.log("Error fetching chat users:", error);
      } finally {
        setLoading(false);
      }
    };

    chatUserHandler();
  }, []);

  // ✅ Search users
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return toast.info("Enter a username to search");

    setLoading(true);
    try {
      const res = await axios.get(`/api/user/search?search=${searchInput}`);
      const data = res.data;

      if (data.success === false) {
        toast.error(data.message);
      } else if (data.length === 0) {
        toast.info("User Not Found");
      } else {
        setSearchUser(data);
      }
    } catch (error) {
      console.log("Search error:", error);
      toast.error("Failed to search user");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Select a user
  const handleUserClick = (user) => {
    onSelectUser(user);
    setSelectedConversation(user);
    setSelectedUserId(user._id);
    setNewMessageUsers("");
  };

  // ✅Back/ Clear search
  const handleSearchBack = () => {
    setSearchUser([]);
    setSearchInput("");
  };

  // ✅ Logout
  const handleLogOut = async () => {
    const confirmLogout = window.prompt(
      `Type "${authUser.username}" to logout`
    );

    if (confirmLogout?.trim().toLowerCase() === authUser.username.toLowerCase()) {
      setLoading(true);
      try {
        const { data } = await axios.post("/api/auth/logout");

        if (data.success === false) {
          toast.error(data.message);
          return;
        }

        toast.success(data.message || "Logged out successfully!");
        localStorage.removeItem("chatapp");
        setAuthUser(null);
        navigate("/login");
      } catch (error) {
        console.log("Logout error:", error);
        toast.error("Logout failed, please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.info("Logout cancelled");
    }
  };

  // ✅ Avatar with online status
  const Avatar = ({ user }) => (
    <div
      className="relative cursor-pointer"
      onClick={() => navigate(`/user/${user._id}`)} // 🔥 yaha navigate kar diya
    >
      <img
        src={user.profilepic || "/default-avatar.png"}
        alt="user"
        className="h-12 w-12 rounded-full object-cover border shadow-sm"
      />
      {isUserOnline(user._id) && (
        <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
      )}
    </div>
  );

  return (
    <div className="h-full w-full max-w-sm px-2 md:px-3 bg-white/10 backdrop-blur-md rounded-xl shadow-md flex flex-col">
      {/* 🔍 Search & Profile */}
      <div className="flex justify-between items-center gap-2 mt-3">
        {/* Search Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center bg-gray-100 rounded-full overflow-hidden flex-1"
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search user"
            className="px-4 w-[85%] bg-transparent outline-none text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="h-12 w-12 md:w-13 flex items-center justify-center rounded-full bg-sky-600 hover:bg-sky-700 transition-colors disabled:opacity-60"
          >
            <BiSearchAlt className="h-5 w-5 text-white" />
          </button>
        </form>

        {/* Profile */}
        <div className="relative group">
          <img
            onClick={() => navigate(`/profile/${authUser?._id}`)}
            src={authUser?.profilepic || "/default-avatar.png"}
            alt="Profile"
            className="h-12 w-12 rounded-full object-cover ring-2 ring-transparent group-hover:ring-sky-500 group-hover:scale-110 transition-all cursor-pointer"
          />
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
            Profile
          </span>
        </div>
      </div>

      <div className="mt-2 border-t border-gray-300"></div>

      {/* 🔽 Search Results OR Chat Users */}
      {searchUser?.length > 0 ? (
        <>
          <div className="flex-1 overflow-y-auto  scrollbar-thin mt-2">
            {searchUser.map((user) => (
              <div key={user._id}>
                <div
                  onClick={() => handleUserClick(user)}
                  className={`flex gap-3 items-center rounded-md py-2 px-4 cursor-pointer transition-colors ${
                    selectedUserId === user._id
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Avatar user={user} />
                  <p className="font-semibold">{user.username}</p>
                </div>
                <div className="border-b border-gray-200"></div>
              </div>
            ))}
          </div>

          {/* Back Button */}
          <div className="mt-2 flex justify-center">
            <button
              onClick={handleSearchBack}
              className="flex items-center gap-0.5 bg-gray-200 hover:bg-gray-400 text-sm rounded-full px-2 py-2 mb-1 transition"
            >
              <BiArrowBack size={18} />
              <p className="font-semibold">Back</p>
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto scrollbar-thin mt-2">
            {loading ? (
              <div className="flex justify-center items-center h-full text-gray-500">
                Loading...
              </div>
            ) : chatUser.length === 0 ? (
              <div className="font-semibold flex flex-col items-center text-center text-sm text-amber-500 mt-10">
                <h1>Why are you Alone!! 🥲</h1>
                <h1>Search username to chat</h1>
              </div>
            ) : (
              chatUser.map((user) => (
                <div key={user._id}>
                  <div
                    onClick={() => handleUserClick(user)}
                    className={`h-16 flex gap-3 items-center rounded-md py-2 px-2 cursor-pointer transition-colors ${
                      selectedUserId === user._id
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-40 w-full">
  {/* Left side: Avatar + Username */}
  <div className="flex items-center gap-2">
    <Avatar user={user} />
    <p className="font-semibold">{user.username}</p>
  </div>

  {/* Right side: Green message count */}
  {newMessageUsers.receiverId === authUser._id &&
  newMessageUsers.senderId === user._id ? (
    <div className="rounded-full bg-green-700 text-xs font-medium text-white px-2 py-[2px]">
      +1
    </div>
  ) : null}
</div>

                  </div>
                  <div className="border-b border-gray-300"></div>
                </div>
              ))
            )}
          </div>

          {/* Logout */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              onClick={handleLogOut}
              disabled={loading}
              className="flex items-center gap-1 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1 rounded-full transition disabled:opacity-60"
            >
              <TbLogout2 size={20} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
