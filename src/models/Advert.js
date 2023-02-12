const mongoose =require("mongoose");
const {SUPPORTER,DEMANDER,PENDING,ACCEPTED,REJECTED,ONLINE,FACETOFACE} = require("../config/constants");

const AdvertSchema = new mongoose.Schema({
    category_id : {type:mongoose.Types.ObjectId,ref:"Category"},
    user_id:{type:mongoose.Types.ObjectId,ref:"User"},
    title:{type:String,index:true},
    description:String,
    date:{type:Date,default:new Date()},
    image_url:String,
    type:{type:String,enum:[SUPPORTER,DEMANDER]},
    postingType:{type:String,enum:[ONLINE,FACETOFACE]},
    city_id:{type:mongoose.Types.ObjectId,ref:"City",index:true},
    isApproved:{type:String,enum:[PENDING,ACCEPTED,REJECTED],default:PENDING},
    isDeleted:{type:Boolean,default:false}
},{timestamps:true,versionKey:false,collection:"adverts"});

AdvertSchema.index({title:1,user_id:1},{unique:true});

const Advert = mongoose.model("Advert",AdvertSchema);
module.exports=Advert;