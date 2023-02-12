const Message = require("../models/Message");
const BaseService = require("./BaseService");
class MessageService extends BaseService{
    constructor(){
        super(Message);
    }

    async list(where, limit, skip) {
        const messages = await Message.find(where)
          .limit(limit)
          .skip(skip)
          .sort({ createdAt: -1 })
          .populate('conversation_id')
          .populate('sender_id');
        
      const total = await Message.find(where).count();
       
      return {total,data:messages};
          
      }
}

module.exports=new MessageService();