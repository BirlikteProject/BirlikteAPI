const UserService = require('../services/UserService');
const errorResponse = require('../scripts/utils/ErrorResponse');
const sendToken = require('../scripts/utils/sendToken');
const {encrypt} = require('../scripts/utils/crypto');
const signIn = async (req, res, next) => {
  const user = await UserService.findOne({ email: req.user.email });
  if (req.user.firebase.sign_in_provider == 'google.com') {
    if (!user) {
      return next(new errorResponse('Giriş yapılamadı!', 404));
    }
    return sendToken(user, 200, res);
  } else if (req.user.firebase.sign_in_provider == 'password') {
    if (!user) {
      return next(new errorResponse('Giriş yapılamadı!', 404));
    }
    return sendToken(user, 200, res);
  } else {
    return next(new errorResponse('Giriş yapılamadı', 400));
  }
};

const signUp = async (req, res, next) => {
  try {
    const { type, tckn, fullName } = req.body;
    
    const user = await UserService.findOne({ email: req.user.email });
    if (req.user.firebase.sign_in_provider == 'google.com') {
      const { name, picture, email } = req.user;

      if (user) {
        return next(
          new errorResponse('Kayıtlı böyle bir email bulunmaktadır.!', 400)
        );
      }
   
      if (!user) {
        const newUser = await UserService.create({
          fullName: name,
          email,
          image_url: picture,
          type,
          tckn : tckn ? encrypt(tckn): "",
        });
        return sendToken(newUser, 201, res);
      }
    } else if (req.user.firebase.sign_in_provider == 'password') {
      if (user) {
        return next(
          new errorResponse('Kayıtlı böyle bir email bulunmaktadır', 400)
        );
      }
      if (!user) {
        const newUser = await UserService.create({
          fullName,
          email,
          type,
          tckn : tckn ? encrypt(tckn): "",
          image_url: '',
        });
        return sendToken(newUser, 201, res);
      }
    } else {
      return next(new errorResponse('Kayıt işlemi hatalı!', 400));
    }
  } catch (err) {
    return next(new errorResponse('Kayıt işlemi hatalı!', 403));
  }
};

module.exports = { signIn, signUp };
