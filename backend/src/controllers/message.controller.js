import Message from "../models/message.model.js";
import User from "../models/user.model.js";

//fetching all users to display on sidebar
const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password"); // fetch all users except the current logged in user and do not fetch the password. This is to display on the sidebar
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar:".error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// fetching messages between sender (currently logged in user & receiver
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;

    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: userToChatId,
        },
        {
          senderId: userToChatId,
          receiverId: myId,
        },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages Controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;

    const { id: receiverId } = req.params;

    const senderId = req._user.id;

    let imageUrl; // undefined

    // if image exists then send to cloudinary and then save it in imageUrl using inbuilt cloudinary function
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    res.status(200).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessages controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
export default getUsersForSidebar;
