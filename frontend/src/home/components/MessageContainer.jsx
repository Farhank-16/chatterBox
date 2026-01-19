import React, { useEffect, useState, useRef } from "react";
import useConversation from "../../Zustand/useConversation";
import { useAuth } from "../../context/AuthContext";
import { IoIosChatboxes } from "react-icons/io";
import { IoMdArrowBack } from "react-icons/io";
import { VscSend } from "react-icons/vsc";
import { MdDeleteSweep } from "react-icons/md";
import axios from "axios";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import { useSocketContext } from "../../context/socketContext";
import notify from '../../assets/sound/Ring.mp3'

const MessageContainer = ({ onBackUser }) => {
  const { messages, selectedConversation, setMessages } = useConversation();
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendData, setSendData] = useState("");
  const lastMessageRef = useRef();
  const [selectedMessages, setSelectedMessages] = useState([]);
  const { socket, onlineUser } = useSocketContext();
  const { addOrMoveChatUser } = useConversation();


  const isOnline = onlineUser.includes(selectedConversation?._id);

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      const sound = new Audio(notify);
      sound.play();
      setMessages([...messages, newMessage])

        setMessages((prev) => [...prev, newMessage]);
  addOrMoveChatUser(selectedConversation);

    })
    return () => socket?.off("newMessage");
  }, [socket, setMessages, messages])

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await axios(`/api/message/${selectedConversation?._id}`);
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sendData.trim()) return;
    setSending(true);
    try {
      const res = await axios.post(`/api/message/send/${selectedConversation?._id}`, { messages: sendData });
      setSendData("");
      setMessages([...messages, res.data]);
      
addOrMoveChatUser(selectedConversation);
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  const getDateLabel = (date) => {
    const msgDate = new Date(date);
    if (isToday(msgDate)) return "Today";
    if (isYesterday(msgDate)) return "Yesterday";
    if (isThisWeek(msgDate)) return format(msgDate, "EEEE");
    return format(msgDate, "dd MMM yyyy");
  };

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      {selectedConversation === null ? (
        <div className="flex flex-col items-center justify-center flex-1 bg-slate-50">
          <div className="p-10 text-center flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-rose-100 rounded-[2.5rem] flex items-center justify-center text-rose-500 shadow-xl shadow-rose-100/50">
               <IoIosChatboxes size={48} />
            </div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Welcome, {authUser?.username}!</h2>
            <p className="text-gray-500 max-w-[250px]">Select a friend from the left to start a secure conversation.</p>
          </div>
        </div>
      ) : (
        <>
          {/* --- Refined Header --- */}
          <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <button onClick={() => onBackUser(true)} className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
                <IoMdArrowBack size={24} className="text-gray-600" />
              </button>
              
              <div className="relative">
                <img className="w-10 h-10 md:w-11 md:h-11 rounded-2xl object-cover border border-gray-100" src={selectedConversation?.profilepic} alt="user" />
                {isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>}
              </div>

              <div>
                <h3 className="font-bold text-gray-900 leading-none">{selectedConversation?.username}</h3>
                <p className={`text-[11px] font-bold uppercase tracking-wider mt-1 ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                  {isOnline ? 'Online Now' : 'Offline'}
                </p>
              </div>
            </div>

            {selectedMessages.length > 0 && (
              <button 
                onClick={async () => {
                  /* Logic to delete selected messages */
                  setSelectedMessages([]);
                }}
                className="flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-rose-100 transition-all"
              >
                <MdDeleteSweep size={20} />
                Delete {selectedMessages.length}
              </button>
            )}
          </header>

          {/* --- Messages Area --- */}
          <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 scrollbar-hide">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
              </div>
            ) : messages?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-40">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No messages yet</p>
              </div>
            ) : (
              messages.map((message, index) => {
                const isMe = message.senderId === authUser._id;
                const prevMsg = messages[index - 1];
                const showDate = !prevMsg || new Date(prevMsg.createdAt).toDateString() !== new Date(message.createdAt).toDateString();

                return (
                  <div key={message?._id} ref={lastMessageRef} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {showDate && (
                      <div className="flex justify-center my-8">
                        <span className="bg-gray-100 text-gray-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-200/50">
                          {getDateLabel(message.createdAt)}
                        </span>
                      </div>
                    )}
                    
                    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      <div
                        onClick={() => {
                          setSelectedMessages(prev => 
                            prev.includes(message._id) ? prev.filter(m => m !== message._id) : [...prev, message._id]
                          );
                        }}
                        className={`group relative px-4 py-3 rounded-2xl max-w-[80%] md:max-w-[70%] text-sm shadow-sm transition-all cursor-pointer hover:shadow-md ${
                          selectedMessages.includes(message._id) ? "ring-4 ring-rose-500/20" : ""
                        } ${isMe ? "bg-rose-500 text-white rounded-tr-none" : "bg-gray-100 text-gray-800 rounded-tl-none"}`}
                      >
                        <p className="leading-relaxed font-medium">{message?.message}</p>
                        
                        {/* Status Dots or Icons could go here */}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 font-bold px-1 uppercase tracking-tighter">
                        {format(new Date(message.createdAt), "hh:mm a")}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </main>

          {/* --- Modern Input Bar --- */}
          <footer className="p-4 md:p-6 bg-white border-t border-gray-100">
            <form onSubmit={handleSubmit} className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-[1.5rem] border border-gray-200 transition-all focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/5">
              <input
                value={sendData}
                onChange={(e) => setSendData(e.target.value)}
                type="text"
                autoComplete="off"
                className="flex-1 bg-transparent outline-none px-4 py-2 text-sm text-gray-800 placeholder:text-gray-400"
                placeholder="Write a message..."
              />
              <button 
                type="submit" 
                disabled={sending || !sendData.trim()}
                className={`flex items-center justify-center w-10 h-10 rounded-2xl transition-all ${
                  sendData.trim() ? "bg-rose-500 text-white shadow-lg shadow-rose-200 active:scale-90" : "bg-gray-200 text-gray-400"
                }`}
              >
                {sending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <VscSend size={20} />
                )}
              </button>
            </form>
          </footer>
        </>
      )}
    </div>
  );
};

export default MessageContainer;