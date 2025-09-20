import Conversation from "../Models/conversationModels.js";
import Message from "../Models/messageSchema.js";
import { getReceiverSocketId, io } from "../Socket/socket.js";

export const sendMessage = async(req,res)=>{
    try {
        const {messages} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        let chats = await Conversation.findOne({
                participants:{$all:[senderId , receiverId]}
        })

        if(!chats){
            chats = await Conversation.create({
            participants:[senderId , receiverId]
            })
        }

        const newMessages = new Message({
            senderId,
            receiverId,
            message:messages,
            conversationId:chats._id
        })

        if(newMessages){
            chats.messages.push(newMessages._id)
        }

        await Promise.all([chats.save(),newMessages.save()]);

        //SOCKET.IO function
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessages)
        }

        res.status(201).send(newMessages)
        
    } catch (error) {
        console.log("Error in sendMessage:", error);
        res.status(500).send({ success: false, message: error.message });
    }
}

export const getMessages = async (req, res) => {
  try {
    const { id:receiverId } = req.params;
    const senderId = req.user._id;

    // find conversation between sender and receiver
    const chats = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate("messages");  // yahan messages properly populate hoga agar ref set hai

    if (!chats) return res.status(200).send([]); 
      const message = chats.messages;

    res.status(200).send(message);  // direct messages bhej do

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
    console.error("Error in getMessages:", error);

  }
   
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params; // message id
    const userId = req.user._id; // logged in user

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    // ✅ sirf wahi user delete kar sake jo sender hai
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // delete from conversation.messages array
    await Conversation.findByIdAndUpdate(message.conversationId, {
      $pull: { messages: message._id },
    });

    await message.deleteOne();

    res.status(200).json({ success: true, message: "Message deleted successfully", id });
  } catch (error) {
    console.error("Error in deleteMessage:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
