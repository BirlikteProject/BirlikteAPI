const mongoose = require("mongoose");


const CategorySchema = new mongoose.Schema({
    name:String,
    image_url:String // aws s3, digitalocean vs. gibi linkler
},{timestamps:true,versionKey:false,collection:"categories"});


const Category = mongoose.model("Category",CategorySchema);

module.exports=Category