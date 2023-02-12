const Conversation = require("../models/Conversation");
const BaseService = require("./BaseService");
class ConversationService extends BaseService{
    constructor(){
        super(Conversation);
    }

    async list(where, limit, skip) {
        const conversations = await Conversation.find(where)
          .limit(limit)
          .skip(skip)
          .sort({ createdAt: -1 })
          .populate('sender_id')
          .populate('receiver_id')
          .populate('advert_id');
        
      const total = await Conversation.find(where).count();
       
      return {total,data:conversations};
          
      }
}

module.exports=new ConversationService();