const Conversation = require('../models/Conversation');
const BaseService = require('./BaseService');
class ConversationService extends BaseService {
  constructor() {
    super(Conversation);
  }

  async list(where, limit, skip) {
    const conversations = await Conversation.find(where)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate('sender_id', 'fullName image_url username email')
      .populate('receiver_id', 'fullName image_url username email')
      .populate({ path: 'advert_id', populate: { path: 'category_id' } })
      .populate({ path: 'advert_id', populate: { path: 'city_id' } });

    const total = await Conversation.find(where).count();

    return { total, data: conversations };
  }
  async findOneAndUpdate(where) {
    const conversation = await Conversation.findOne(where)
      .populate('sender_id', 'fullName image_url username email')
      .populate('receiver_id', 'fullName image_url username email')
      .populate({ path: 'advert_id', populate: { path: 'category_id' } })
      .populate({ path: 'advert_id', populate: { path: 'city_id' } });
    return conversation;
    }
}

module.exports = new ConversationService();
