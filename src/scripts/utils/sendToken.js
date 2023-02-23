const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    user.tckn=undefined;
    delete user.tckn;
    res.status(statusCode).json({ status: true,message:"Başarılı", data:{token,user} });
  };

  module.exports=sendToken;