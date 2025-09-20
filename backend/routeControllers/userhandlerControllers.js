import Conversation from "../Models/conversationModels.js";
import User from "../Models/userModels.js";

export const getUserBySearch = async (req, res) => {
  try {
    const search = req.query.search || "";
    const currentUserID = req.user._id;
    const user = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: ".*" + search + ".*", $options: "i" } },
            { fullname: { $regex: ".*" + search + ".*", $options: "i" } },
          ]
        },
        {
          _id: { $ne: currentUserID },
        },
      ]
    })
      .select("-password")
      .select("email username fullname");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
    console.log(error)
  }
};


export const getCurrentChatters = async (req, res) => {
  try {
    const currentUserID = req.user._id;
    const currentchatters = await Conversation.find({
      participants: currentUserID,
    }).sort({ updatedAt: -1 });

    if (!currentchatters || currentchatters.length === 0)
      return res.status(200).json([]);

    const participantsIDS = currentchatters.reduce((ids, conversation) => {
      const otherParticipants = conversation.participants.filter(
        (id) => id !== currentUserID
      );
      return [...ids, ...otherParticipants];
    }, []);

    const otherParticipants = participantsIDS.filter(
      (id) => id.toString() !== currentUserID.toString()
    );

    const user = await User.find({ _id: { $in: otherParticipants } }).select(
      "-password -email "
    );

    const users = otherParticipants.map((id) =>
      user.find((user) => user._id.toString() === id.toString())
    );

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
    console.log(error)
  }
};
