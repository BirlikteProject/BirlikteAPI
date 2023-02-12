const CategoryService = require('../services/CategoryService');
const errorResponse = require('../scripts/utils/ErrorResponse');
const {ADMIN} = require("../config/constants");
const getCategories = async (req, res, next) => {
  CategoryService.list()
    .then((result) => {
      return res
        .status(200)
        .json({
          status: true,
          message: 'Kategoriler başarıyla getirildi!',
          data: result,
        });
    })
    .catch((err) =>{ return next(new errorResponse('Kategoriler getirilemedi', 404))});
};

const addCategory = async (req, res, next) => {
  try {
    const user = req.user;
    const {name,image_url} = req.body;
    if(user.type===ADMIN){
        const newCategory = await CategoryService.create({name,image_url});
        if(!newCategory){
            return next(new errorResponse("Kategori oluşturulamadı!",400));
        }
        return res.status(201).json({status:true,message:"Kategori oluşturuldu!",data:newCategory});
    }else {
        return next(new errorResponse("Kategori eklemek için yetkiniz yok!",401))
    }
  } catch (err) {
    return next(new errorResponse('Kategori eklenemedi', 400));
  }
};

module.exports = { getCategories, addCategory };
