const io = require("socket.io")(3200, { perMessageDeflate: true });
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const User = require("./src/models/User");
// const Conversation = require("./src/models/Conversation");

// dotenv.config();


// Error handling function for authentication errors
// const handleAuthenticationError = (err, socket) => {
//   if (err) {
//     socket.emit('unauthorized', { message: err });
//   } else {
//     socket.disconnect();
//   }
// };
io.use(authMiddleware);
// io.use((socket, next) => {
//   handleAuthenticationError("Yetkisiz giriş", socket);
// });

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  // return User.findById(userId);
  return users.find((user) => user.userId === userId);
};

// const userIsOnline= (userId) => {
//   return users.find((user) => user.userId === userId) ? true : false;
// }

try {
  io.on("connection", async (socket) => {
    console.log("connection");
    
    socket.on("addUser", ({ userId }) => {
      console.log("add user",userId)
          addUser(userId, socket.id);
          
          io.emit("getUsers", users);
        });
        
    //  socket.on("online",({userId})=> {
    //       console.log("online",userId)

    //     io.emit("userIsOnline",userIsOnline(userId));
    //   })
      
    socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
          try{
            console.log("send Message",senderId,"receiver",receiverId)
            const user = getUser(receiverId);
            
            io.to(user?.socketId).emit("getMessage", {
              senderId,
              text,
            });
    
          }catch(err){
            console.log(err);
          }
  
        });   
    // çıkış yaptığında
    socket.on('disconnect', () => {
      console.log('disconnect');
      removeUser(socket.id);
      // removePlaceUser(socket.id) // bunu nasıl yapıcağını düşün ?
      io.emit('getUsers', users);
    });
  });
} catch (error) {
  console.log(error);
}
