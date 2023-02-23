const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
    name:{type:String},
},{versionKey:false,collection:"cities"});

const City = mongoose.model("City",CitySchema);

module.exports=City
