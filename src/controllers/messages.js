const MessageService = require('../services/MessageService');
const ConversationService = require('../services/ConversationService');
const errorResponse = require('../scripts/utils/ErrorResponse');
const date = require('date-and-time');
// const io = require("socket.io-client");
const sendMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user._id;
    const { message } = req.body;

    const conversation = await ConversationService.findOne({
      _id: id,
      ended_conversation: false,
      $or: [{ sender_id: user_id }, { receiver_id: user_id }],
    });
    if (!conversation) {
      return next(
        new errorResponse('Mesaj gönderilecek bir iletişim kanalı bulunamadı!',404)
      );
    }
    const savedMessage = await MessageService.create({
      sender_id: user_id,
      conversation_id: conversation._id,
      message,
      time: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
    });
    if (!savedMessage) {
      return next(new errorResponse('Mesaj gönderilemedi', 400));
    }

    conversation.last_message = savedMessage.message;
    conversation.last_message_date = savedMessage.time;
    await conversation.save();
    return res.status(201).json({
      status: true,
      message: 'Mesaj başarıyla iletildi!',
      data: savedMessage,
    });
    // ! mesaj arttırma olayını daha sonradan yapabiliriz gelen mesaj sayısı
    // const socket=io('ws://localhost:3200', { transports: ['websocket'] });
  } catch (err) {
    console.log(err)
    return next(new errorResponse('Mesaj gönderilemedi', 403));
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user._id;
    let page = parseInt(req.query.page) || 1;
    let limit = req.query.limit;
    let skip = (page - 1) * limit;
    page < 1 ? (page = 1) : null; //page 0 -1 vs. gibi durumların kontrolü

    const conversation = await ConversationService.findOne({
      _id: id,
      ended_conversation: false,
      $or: [{ sender_id: user_id }, { receiver_id: user_id }],
    });
    if (!conversation) {
      return next(new errorResponse('Böyle bir conversation bulunamadı!', 404));
    }
    const where = {
        conversation_id:conversation._id
    }
    const { data, total } = await MessageService.list(where, limit, skip);
// ! conversation_id populate etmeye gerek var mı ?
    return res.status(200).json({
      total,
      status: true,
      message: 'Mesajlar başarılı bir şekilde getirildi!',
      data: data,
    });
  } catch (err) {
    return next(new errorResponse('Mesajlar getirilemedi', 403));
  }
};

module.exports = { sendMessage, getMessages };
