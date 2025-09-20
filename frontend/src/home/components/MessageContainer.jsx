import React, { useEffect, useState, useRef } from "react";
import useConversation from "../../Zustand/useConversation";
import { useAuth } from "../../context/AuthContext";
import { IoIosChatboxes } from "react-icons/io";
import { IoMdArrowBack } from "react-icons/io";
import { VscSend } from "react-icons/vsc";
import axios from "axios";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import { useSocketContext } from "../../context/socketContext";
import notify from '../../assets/sound/Ring.mp3'

const MessageContainer = ({ onBackUser }) => {
  const { messages, selectedConversation, setMessages , setSelectedConversation} = useConversation();
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendData, setSendData] = useState("");
  const lastMessageRef = useRef();
  const [selectedMessages, setSelectedMessages] = useState([]);
  const {socket} = useSocketContext();

  useEffect(()=>{
    socket?.on("newMessage",(newMessage)=>{
      const sound = new Audio(notify);
      sound.play();
      setMessages([...messages,newMessage])
    })
    return ()=>socket?.off("newMessage");
  },[socket,setMessages,messages] )

  // Scroll to last message
  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  // Fetch messages
  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const get = await axios(`/api/message/${selectedConversation?._id}`);
        const data = await get.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        } 
          setLoading(false);
          setMessages(data);
                  
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);
  console.log(messages);

  const handleMessages = (e) => {
    setSendData(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await axios.post(`/api/message/send/${selectedConversation?._id}`,
        { messages: sendData }
      );

      const data =await res.data;
      if (data.success === false) {
        setSending(false);
        console.log(data.message);
      } 
        setSending(false);
        setSendData("");
        setMessages([...messages,data])
      
      } catch (error) {
      setSending(false);
      console.log(error);
    }
  };

  // 📌 Function for date separators
  const getDateLabel = (date) => {
    const msgDate = new Date(date);
    if (isToday(msgDate)) return "Today";
    if (isYesterday(msgDate)) return "Yesterday";
    if (isThisWeek(msgDate)) return format(msgDate, "EEEE"); // Monday, Tuesday...
    return format(msgDate, "dd/MM/yyyy");
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl md:min-w-[500px]  h-full flex flex-col">
      {selectedConversation === null ? (
        // Empty state
        <div className="flex items-center justify-center flex-1">
          <div className="px-4 text-center text-2xl text-gray-50 font-semibold flex flex-col items-center gap-2">
            <p className="text-2xl">Welcome! {authUser?.username} 😎</p>
            <p className="text-lg">Select a chat to start chatting</p>
            <IoIosChatboxes className="text-6xl text-center" />
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between gap-1 bg-sky-600 md:px-2 rounded-lg h-16 md:h-12">
            <div className="flex gap-2 md:justify-between items-center w-full">
              <div className="md:hidden ml-1 self-center">
                <button onClick={() => onBackUser(true)} className="bg-white rounded-full px-2 py-1 self-center" >
                  <IoMdArrowBack size={25} />
                </button>
              </div>
              <div className="flex justify-between mr-2 gap-2">
                <div className="self-center">
                  <img className="rounded-full w-12 h-12 md:w-10 md:h-10 cursor-pointer" src={selectedConversation?.profilepic} alt="profilepic" />
                </div>
                <span className="text-gray-100 self-center text-[18px] md:text-xl font-semibold">
                  {selectedConversation?.username}
                </span>
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-auto px-3 py-2 space-y-2">
            {loading && (
              <div className="flex w-full h-full flex-col items-center  justify-center gap-4 bg-transparent">
                {/* <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div> */}
              </div>
            )}
            {!loading && messages?.length === 0 && (
              <p className="text-center items-center text-gray-100">
                Send a message to start conversation 
              </p>
            )}
            {!loading && messages?.length > 0 && messages?.map((message, index) => {
              const prevMsg = messages[index - 1];
              const showDateSeparator =
                !prevMsg ||
                new Date(prevMsg.createdAt).toDateString() !== new Date(message.createdAt).toDateString();

              return (
                <div key={message?._id} ref={lastMessageRef}>
                  {showDateSeparator && (
                    <div className="flex justify-center my-2">
                      <span className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {getDateLabel(message.createdAt)}
                      </span>
                    </div>
                  )}
                  <div className={`flex mb-1 ${ message.senderId === authUser._id ? "justify-end" : "justify-start" }`} >
                    {/* Bubble */}
                    <div
                      onClick={() => {
                        if (selectedMessages.includes(message._id)) {
                          setSelectedMessages(selectedMessages.filter(m => m !== message._id));
                        } else {
                          setSelectedMessages([...selectedMessages, message._id]);
                        }
                      }}
                      className={`relative px-3 py-2 rounded-lg max-w-xs break-words cursor-pointer ${
                        selectedMessages.includes(message._id) ? "ring-2 ring-red-500" : ""
                      } ${ message.senderId === authUser._id ? "bg-sky-600 text-white" : "bg-gray-700 text-white" }
                        ${ message.senderId === authUser._id
                          ? "rounded-br-none after:content-[''] after:absolute after:-right-2 after:top-2 after:border-8 after:border-transparent after:border-l-sky-600"
                          : "rounded-bl-none after:content-[''] after:absolute after:-left-2 after:top-2 after:border-8 after:border-transparent after:border-r-gray-700"
                        }`}
                    >
                      <p>{message?.message}</p>
                    </div>
                  </div>
                  {/* Time outside bubble */}
                  <div className={`text-[10px] text-gray-800 ${ message.senderId === authUser._id ? "text-right pr-2" : "text-left pl-2" }`} >
                    {new Date(message?.createdAt).toLocaleTimeString(
                      "en-IN",
                      { hour: "numeric", minute: "numeric" }
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedMessages.length > 0 && (
            <div className="p-2 bg-red-100 flex justify-between items-center">
              <p>{selectedMessages.length} selected</p>
              <button
                onClick={async () => {
                  try {
                    for (let id of selectedMessages) {
                      await axios.delete(`/api/message/${id}`);
                    }
                    setMessages(messages.filter(m => !selectedMessages.includes(m._id)));
                    setSelectedMessages([]);
                  } catch (err) {
                    console.error("Delete error:", err);
                  }
                }}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          )}

          {/* Input bar */}
          <form onSubmit={handleSubmit} className="w-full p-2 rounded-lg bg-gray-100 flex items-center gap-2" >
            <input
              value={sendData}
              onChange={handleMessages}
              required
              id="message"
              type="text"
              className="flex-1 bg-white outline-none px-4 py-2 rounded-full border"
              placeholder="Type a message..."
            />
            <button type="submit" disabled={sending}>
              {sending ? (
                <div className="w-8 h-8 rounded-full bg-sky-200 animate-pulse"></div>
              ) : (
                <VscSend
                  size={25}
                  className="hover:text-white text-sky-600 w-8 h-8 cursor-pointer rounded-full hover:bg-gray-600 p-1 bg-sky-200 transition"
                />
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default MessageContainer;
