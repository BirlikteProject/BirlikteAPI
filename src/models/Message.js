const mongoose = require('mongoose');


const MessageSchema = new mongoose.Schema({
    conversation_id:{type:mongoose.Types.ObjectId,ref:"Conversation"},
    sender_id:{type:mongoose.Types.ObjectId,ref:"User"},
    time:{type:Date,default:new Date()},
    message:String,

},{timestamps:true,versionKey:false,collection:"messages"});

const Message = mongoose.model("Message",MessageSchema);
module.exports=Message;