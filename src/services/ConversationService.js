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
          .populate('sender_id','fullName image_url username email')
          .populate('receiver_id','fullName image_url username email')
          .populate({ path: 'advert_id', populate: { path: 'category_id',path:'city_id' } });
        
      const total = await Conversation.find(where).count();
       
      return {total,data:conversations};
          
      }
}

module.exports=new ConversationService();