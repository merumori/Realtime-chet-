const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  deleteMessage,
  deleteAllMessages,
} = require('../controllers/chatController');

router.post('/send', sendMessage);
router.get('/:userId/:receiverId', getMessages);
router.delete('/:id', deleteMessage);
router.delete('/all/:userId/:receiverId', deleteAllMessages);

module.exports = router;
