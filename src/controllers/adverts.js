const AdvertService = require('../services/AdvertService');
const UserService = require('../services/UserService');
const errorResponse = require('../scripts/utils/ErrorResponse');
const { ACCEPTED, ADMIN } = require('../config/constants');
const { uploadImage } = require('../scripts/utils/upload');

const addAdvert = async (req, res, next) => {
  try {
    const user = req.user;
    // * type,user_id
    const { title, description, category_id, city_id, postingType } = req.body;

    const { image_url } = req.body;
    const categories = [
      {
        _id: '63e8ebcb1f42670b82d7d8d5',
        name: 'Psikolojik Destek',
        image_url: '',
      },
      { _id: '63e8ebb91f42670b82d7d8d3', name: 'Barınma', image_url: '' },
      { _id: '63e7c86d752984d395d3dcf1', name: 'İstihdam', image_url: '' },
      { _id: '63e7c856752984d395d3dcee', name: 'Eğitim', image_url: '' },
      {
        _id: '63eac436780b4e796f00132b',
        name: 'Sosyal Alan & Destek',
        image_url: '',
      },
    ];
    let categoryResult;
    if (!image_url) {
      categoryResult = categories.find(
        (category) => category_id == category._id
      );
    }

    const checkAdvert = await AdvertService.findOne({
      title,
      user_id: user._id,
    });
    if (checkAdvert) {
      return next(
        new errorResponse('Aynı isimde ilanınız bulunmaktadır!', 400)
      );
    }
    const file = req.file;
    // if (!file) {
    //   return next(new errorResponse('Resim seçmediniz!', 400));
    // }
    let result;
    if (file) {
      const streamLength = file.buffer.length;
      const maxSize = 10 * 1024 * 1024;
      if (streamLength > maxSize) {
        return next(new errorResponse("Resim 10 mb'den fazla olamaz!", 400));
      }
      result = await uploadImage(file, next);
      //!resim işleminde hata varsa işleme devam etme
      if (!result.status) {
        return;
      }
    }

    const data = {
      title,
      description,
      image_url: file ? result?.data : categoryResult?.image_url, // dosya yükleme işlemi yapmıyorsa, kategoriye göre resim seçip gönderilecek.
      type: user.type,
      user_id: user._id,
      category_id,
      city_id,
      postingType,
    };
    const advert = await AdvertService.create(data);
    if (!advert) {
      return next(new errorResponse('İlan oluşturulamadı', 404));
    }

    if (advert) {
      return res.status(201).json({
        status: true,
        message: 'İlan oluşturuldu!',
        data: advert,
      });
    }
  } catch (err) {
    if (err.code === 11000) {
      return next(
        new errorResponse('Aynı isimde ilanınız bulunmaktadır!', 400)
      );
    }
    return next(new errorResponse('İlan eklenemedi!', 400));
  }
};

const getAdvert = async (req, res, next) => {
  try {
    const { id } = req.params;
    // ! findById kullanılabilir isDeleted silinirse
    const advert = await AdvertService.findOne({ _id: id, isDeleted: false });

    if (!advert) {
      return next(new errorResponse('İlan bulunamadı!', 404));
    }
    return res
      .status(200)
      .json({ status: true, message: 'İlan getirildi!', data: advert });
  } catch (err) {
    console.log(err);
    return next(new errorResponse('İlan getirilemedi!', 400));
  }
};

// ! filterelemelere tekrar bakılacak , örneğin şehir, oluşturulma tarihi
const getAdverts = async (req, res, next) => {
  try {
    // online veya facetoface filtresi ekle
    let page = parseInt(req.query.page) || 1;
    let limit = req.query.limit;
    let skip = (page - 1) * limit;
    page < 1 ? (page = 1) : null; //page 0 -1 vs. gibi durumların kontrolü
    const {type,term,city_id} = req.query;
    // type belirtilmemiş ise
    let  where = { isApproved: ACCEPTED, isDeleted: false };
    if(city_id){
      where.city_id=city_id;
    }
    if(term){
      where.title=new RegExp(term, 'i');
    }
    if(type){
      where.type=type;
    }

    const { data, total } = await AdvertService.listPagination(
      where,
      limit,
      skip
    );

    return res.status(200).json({
      total,
      status: true,
      message: 'İlanlar başarılı bir şekilde getirildi!',
      data: data,
    });
  } catch (err) {
    console.log(err);
    next(new errorResponse('İlanlar getirilirken hata meydana geldi!', 400));
  }
};

const updateAdvert = async (req, res, next) => {
  try {
    const { id } = req.params;

    const advert = await AdvertService.findOne({ _id: id, isDeleted: false });
    if (!advert) {
      return next(new errorResponse('Güncellenecek İlan bulunamadı', 404));
    }
    const {
      title,
      description,
      category_id,
      image_url,
      type,
      postingType,
      city_id,
    } = req.body;

    const user = req.user;
    // * Giriş yapmış kullanıcı İlanın sahibi veya admin mi?

    if (
      user._id.toString() === advert.user_id._id.toString() ||
      user.type === ADMIN
    ) {
      const where = {
        title,
        description,
        date: new Date(),
        createdAt: new Date(),
        category_id,
        image_url,
        type,
        postingType,
        city_id,
      };
      // ! where date ve createdAt harici geldiğinde de çalışıyor ve güncelliyor düzenlenebilir.
      const updatedAdvert = await AdvertService.update(id, where);
      if (!updatedAdvert) {
        return next(new errorResponse('Güncelleme işlemi başarısız!'), 400);
      }
      return res.status(200).json({
        status: true,
        message: 'İlan güncellendi!',
        data: updatedAdvert,
      });
    }

    // return next(new errorResponse('Güncelleme yetkisine sahip değilsiniz!', 403));
  } catch (err) {
    if (err.code === 11000) {
      return next(
        new errorResponse(
          'Güncelleme başarısız, Aynı isimde ilanınız bulunmaktadır!'
        ),
        400
      );
    }
    return next(new errorResponse('İlan güncelleme başarısız!', 400));
  }
};

const deleteAdvert = async (req, res, next) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const advert = await AdvertService.findOne({
      _id: id,
      isDeleted: false,
      user_id: user._id,
    });
    if (!advert) {
      return next(new errorResponse('Silinecek İlan bulunamadı', 404));
    }
    // * Giriş yapmış kullanıcı İlanın sahibi veya admin mi?
    if (
      user?._id.toString() === advert?.user_id._id.toString() ||
      user.type === ADMIN
    ) {
      const deletedAdvert = await AdvertService.update(id, { isDeleted: true });
      if (!deletedAdvert) {
        return next(new errorResponse('İlan silinemedi!', 400));
      }
      // ! data kısmı verilmeyebilir data--> null
      return res.status(200).json({
        status: true,
        message: 'İlan başarıyla silindi!',
        data: deletedAdvert,
      });
    }

    return next(new errorResponse('İlan silme işleminiz başarısız', 403));
  } catch (err) {
    return next(new errorResponse('İlan silme işleminiz başarısız!', 403));
  }
};


const getAdvertsByCategory = async (req, res, next) => {
  try {
    const { category_id } = req.params;
    let page = parseInt(req.query.page) || 1;
    let limit = req.query.limit;
    let skip = (page - 1) * limit;
    // ! düzeltilecek
    page < 1 ? (page = 1) : null; //page 0 -1 vs. gibi durumların kontrolü
    const type = req.query.type;
    // type belirtilmemiş ise
    let where;
    if (!type) {
      where = { isApproved: ACCEPTED, category_id, isDeleted: false };
    } else {
      where = {
        isApproved: ACCEPTED, // * Onaylanmış
        category_id,
        isDeleted: false,
        type,
      };
    }
    const { data, total } = await AdvertService.listPagination(
      where,
      limit,
      skip
    );

    return res
      .status(200)
      .json({
        total,
        status: true,
        message: 'İlanlar kategorisine göre getirildi!',
        data,
      });
  } catch (err) {
    return next(
      new errorResponse('İlanlar kategorisine göre getirilemedi!', 403)
    );
  }
};

const getAdvertsByProfile = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const where = {
      user_id,
      isDeleted: false,
    };
    const user = await UserService.findById(user_id);

    if (!user) {
      return next(
        new errorResponse('Böyle bir kullanıcı bulunmamaktadır!'),
        404
      );
    }
    const adverts = await AdvertService.listProfile(where);

    return res
      .status(200)
      .json({
        total: adverts.length,
        status: true,
        message: 'İlanlar başarılı bir şekilde getirildi!',
        data: adverts,
      });
  } catch (err) {
    console.log(err);
    return next(new errorResponse('İlanlar getirilemedi!', 403));
  }
};

module.exports = {
  addAdvert,
  getAdvert,
  getAdverts,
  updateAdvert,
  deleteAdvert,
  getAdvertsByCategory,
  getAdvertsByProfile,
};
