import { Message } from "../models/Message.js";

const getMessages = async (req, res) => {
    const { userId, contactId } = req.params;

    try {
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: contactId },
                { senderId: contactId, receiverId: userId }
            ]
        })
            .sort({ timestamp: 1 })
            .exec();

        res.status(200).json(messages);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
};

export default getMessages;
