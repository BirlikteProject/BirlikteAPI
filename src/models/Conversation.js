const mongoose = require("mongoose");
const errorResponse = require("../scripts/utils/ErrorResponse");

const ConversationSchema = new mongoose.Schema({
    sender_id:{type:mongoose.Types.ObjectId,ref:"User"},
    receiver_id:{type:mongoose.Types.ObjectId,ref:"User"},
    advert_id:{type:mongoose.Types.ObjectId,ref:"Advert"},
    last_message:String,
    last_message_date:Date, // string olabilir
    deal:{type:Boolean,default:false},
    ended_conversation:{type:Boolean,default:false}
},{timestamps:true,versionKey:false,collection:"conversations"});

ConversationSchema.index({sender_id:1,receiver_id:1,advert_id:1},{unique:true})
ConversationSchema.pre('save', function(next) {
    if (this.sender_id.toString() === this.receiver_id.toString()) {
      return next(new errorResponse('Sender ID and Receiver ID cannot be the same',400));
    }
    next();
  });
const Conversation = mongoose.model("Conversation",ConversationSchema);

module.exports=Conversation;