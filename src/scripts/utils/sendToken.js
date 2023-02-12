const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({ status: true,message:"Başarılı", data:token });
  };

  module.exports=sendToken;