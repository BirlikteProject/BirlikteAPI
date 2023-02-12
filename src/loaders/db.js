
const mongoose = require("mongoose");

const db = mongoose.connection;

db.once("open",()=> {
    console.log("DB bağlantısı başarılı.");
})



const connectDB = async () => {

    await mongoose.connect(process.env.MONGO_URI)
}

module.exports = {connectDB};
