const io = require('socket.io')(3200, { perMessageDeflate: true });
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const jwt = require('jsonwebtoken');
const date = require('date-and-time');
const tr = require('date-and-time/locale/tr');

date.locale(tr);
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('mongoose bağlantısı başarılı');
  })
  .catch(function (error) {
    console.log(error);
  });

const authMiddleware = async (socket, next) => {
  const token = socket.handshake.auth.token; // token socket bağlantısı sırasında auth parametresinde gönderilir
  console.log('socket', socket);
  console.log('socket-handshake', socket.handshake);
  console.log('token', token);
  if (!token) {
    return next(new Error('Giriş yapmadınız. Lütfen giriş yapın.'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return next(new Error('JWT token doğrulanamadı.'));
    }
    if (decoded) {
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new Error('Böyle bir kullanıcı bulunamadı.'));
      }
      user.tckn = undefined;
      delete user.tckn;
      socket.user = user; // user objesini socket'e ekle, böylece diğer yerlerde kullanılabilir
      return next();
    }
  } catch (err) {
    console.log(err);
    return next(new Error('Geçersiz token.'));
  }
};

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
  io.on('connection', async (socket) => {
    console.log('connection');

    socket.on('addUser', async () => {
      console.log('socket.user', socket.user);
      addUser(socket?.user?._id.toString(), socket?.id);

      io.emit('getUsers', users);
    });

    //  socket.on("online",({userId})=> {
    //       console.log("online",userId)

    //     io.emit("userIsOnline",userIsOnline(userId));
    //   })

    socket.on('sendMessage', async ({ conversationId,receiverId, text }) => {
      try {
        const user = getUser(receiverId);

        io.to(user?.socketId).emit('getMessage', {
          senderId: socket.user,
          conversationId,
          time: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
          message: text,
        });
      } catch (err) {
        return console.log(err.message);
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
