const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {DEMANDER,SUPPORTER} = require("../config/constants");
const UserSchema = new mongoose.Schema({
    fullName:String,
    phone:String,
    email:{type:String,unique:true},
    about:String,
    username:String,
    image_url:String,
    tckn:String,
    city_id:{type:mongoose.Types.ObjectId,ref:"City"},
    type:{type:String,enum:[DEMANDER,SUPPORTER],lowercase:true} // * Admin --> Admin , Supporter --> Destekleyen , Demander --> Depremzede, ihtiyaç sahibi
},{timestamps:true,versionKey:false,collection:"users"});

UserSchema.methods.getSignedToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  };
const User = mongoose.model("User",UserSchema);
module.exports=User