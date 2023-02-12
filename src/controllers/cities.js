const CityService = require('../services/CityService');
const errorResponse = require('../scripts/utils/ErrorResponse');
const getCities = async (req, res, next) => {
  try {
    const cities = await CityService.list();
    return res.status(200).json({status:true,message:"Şehirler başarılı bir şekilde getirildi!",data:cities})
  } catch (err) {
    return next(new errorResponse('Şehirler getirilemedi!', 404));
  }
};

module.exports={getCities}