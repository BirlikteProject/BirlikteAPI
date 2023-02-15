const ConversationService = require('../services/ConversationService');
const AdvertService = require('../services/AdvertService');
const UserService = require('../services/UserService');
const errorResponse = require('../scripts/utils/ErrorResponse');

const createConversation = async (req, res, next) => {
  try {
    //bu iki kişiden birisi advert_id'ye sahip mi
    const user = req.user;
    const { advert_id, receiver_id } = req.body;
    const advert = await AdvertService.findById(advert_id);
    if (!advert) {
      return next(
        new errorResponse('Mesaj oluşturulacak İlan bulunamadı!', 404)
      );
    }
    const receiver_user = await UserService.findById(receiver_id);
    if (!receiver_user) {
      return next(
        new errorResponse('Mesaj atılacak kullanıcı bulunamadı!', 404)
      );
    }
    // ! sender_id veya receiver_id ilanın sahibi mi ?
    if (
      advert.user_id.toString() === user._id.toString() ||
      advert.user_id.toString() === receiver_id.toString()
    ) {
      const data = {
        sender_id: user._id,
        receiver_id,
        advert_id,
        last_message: '',
      };
      const conversation = await ConversationService.create(data);
      if (!conversation) {
        return next(new errorResponse('İletişim kanalı oluşturulamadı!'), 400);
      }

      return res.status(201).json({
        status: true,
        message: 'İletişim kanalı oluşturuldu',
        data: conversation,
      });
    }

    return next(new errorResponse('İletişim kanalı oluşturulamadı!', 403));
  } catch (err) {
    if(err.statusCode===400){
      return next(new errorResponse("Kendi kendinize iletişim kanalı oluşturamazsınız!",400))
    }
    return next(new errorResponse('İletişim kanalı oluşturulamadı!',403) );
  }
};

const deleteConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user._id;
    const conversation = await ConversationService.findOne({
      _id: id,
      ended_conversation: false,
    });
    if (!conversation) {
      return next(
        new errorResponse('Silinecek bir iletişim kanalı bulunamadı!'),
        404
      );
    }
    const { receiver_id, sender_id } = conversation;
    // ! conversation'da user_id si var mı receiver_id veya sender_id
    if (
      sender_id.toString() === user_id.toString() ||
      receiver_id.toString() === user_id.toString()
    ) {
      const deletedConversation = await ConversationService.update(id, {
        ended_conversation: true,
      });
      if (!deletedConversation) {
        return next(new errorResponse('İletişim kanalı silinemedi!', 404));
      }
      return res.status(200).json({
        status: true,
        message: 'İletişim kanalı başarıyla silindi!',
        data: deletedConversation,
      });
    }
    return next(
      new errorResponse('Bu iletişim kanalını silmeye yetkiniz yok', 401)
    );
  } catch (err) {
    return next(new errorResponse('İletişim kanalı silme başarısız!'), 403);
  }
};

const getConversations = async (req, res, next) => {
  try {
    const user_id = req.user._id;
    let page = parseInt(req.query.page) || 1;
    let limit = req.query.limit;
    limit < 1 ? limit=10 : null;
    let skip = (page - 1) * limit;
    page < 1 ? (page = 1) : null; //page 0 -1 vs. gibi durumların kontrolü
    const deal = req.query.deal; // 0-- false 1--true
    // deal --> true ise anlaştıklarımız , deal --> false ise sonuçlanmamış veya anlaşamadıklarımız
    const where = {
      deal:deal==1 ? true : false, 
      ended_conversation: false,
      $or: [{ sender_id: user_id }, { receiver_id: user_id }],
    };
    const { data, total } = await ConversationService.list(where, limit, skip);
    let conversationArr = [];
    data.map((conversation) => {
      const sender_id = conversation.sender_id;
      const receiver_id = conversation.receiver_id;
      const advert_id = conversation.advert_id;
      const {
        last_message,
        last_message_date,
        deal,
        createdAt,
        updatedAt,
        ended_conversation,
        _id,
      } = conversation;
      const data = {
        _id,
        advert_id,
        last_message,
        last_message_date,
        deal,
        createdAt,
        updatedAt,
        ended_conversation,
      };
      if (sender_id._id.toString() === user_id.toString()) {
        return conversationArr.push({ sender_id: null, receiver_id, ...data });
      } else {
        return conversationArr.push({ sender_id, receiver_id: null, ...data });
      }
    });
    return res.status(200).json({
      total,
      status: true,
      message: 'İletişim kanalları başarılı bir şekilde getirildi!',
      data: conversationArr,
    });
  } catch (err) {
    console.log(err);
    return next(new errorResponse('İletişim kanalları getirilemedi!', 404));
  }
};
module.exports = { createConversation, deleteConversation, getConversations };
