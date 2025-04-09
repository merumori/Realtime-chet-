const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  const message = new Message(req.body);
  await message.save();
  res.status(201).json(message);
};

exports.getMessages = async (req, res) => {
  const { userId, receiverId } = req.params;
  const messages = await Message.find({
    $or: [
      { senderId: userId, receiverId },
      { senderId: receiverId, receiverId: userId },
    ],
  }).sort('timestamp');
  res.json(messages);
};

exports.deleteMessage = async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};

exports.deleteAllMessages = async (req, res) => {
  const { userId, receiverId } = req.params;
  await Message.deleteMany({
    $or: [
      { senderId: userId, receiverId },
      { senderId: receiverId, receiverId: userId },
    ],
  });
  res.sendStatus(204);
};
