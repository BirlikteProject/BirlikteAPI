const AdvertService = require('../services/AdvertService');
const errorResponse = require('../scripts/utils/ErrorResponse');
const { ACCEPTED, ADMIN } = require('../config/constants');
const addAdvert = async (req, res, next) => {
  try {
    const user = req.user;
    // * type,user_id
    const { title, description, image_url, category_id, city_id, postingType } =
      req.body;
    const data = {
      title,
      description,
      image_url,
      type: user.type,
      user_id: user._id,
      category_id,
      city_id,
      postingType,
    };
    const advert = await AdvertService.create(data);
    if (!advert) {
      next(new errorResponse('İlan oluşturulamadı', 404));
    }
    return res
      .status(201)
      .json({ status: true, message: 'İlan oluşturuldu!', data: advert });
  } catch (err) {
    if (err.code === 11000) {
      return next(
        new errorResponse('Aynı isimde ilanınız bulunmaktadır!'),
        400
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
    const type = req.query.type;
    // type belirtilmemiş ise
    let where;
    if (!type) {
      where = { isApproved: ACCEPTED, isDeleted: false };
    } else {
      where = {
        isApproved: ACCEPTED, // * Onaylanmış
        isDeleted: false,
        type,
      };
    }

    const { data, total } = await AdvertService.list(where, limit, skip);

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
      // ! where date ve createdAt harici geldiğinde de çalışıyor ve günceliyor düzenlenebilir.
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
    const advert = await AdvertService.findOne({ _id: id, isDeleted:false ,user_id:user._id });
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
      return res
        .status(200)
        .json({
          status: true,
          message: 'İlan başarıyla silindi!',
          data: deletedAdvert,
        });
    }

    return next(new errorResponse("İlan silme işleminiz başarısız",403))
  } catch (err) {
    return next(new errorResponse('İlan silme işleminiz başarısız!',403));
  }
};

const searchAdvert = async (req, res, next) => {
  try {
    // ! validasyon ekle
    const { city_id } = req.params;
    const { term } = req.query;
    // * title' ve şehirde arama
    // ! limit eklenebilir daha sonradan örneğin 50 tane gelsin(sorted edilmiş halde)
    if (term && city_id) {
      const {total,data} = await AdvertService.search(city_id, term);
      return res
        .status(200)
        .json({
          total,
          status: true,
          message: 'Sonuçlar başarılı bir şekilde getirildi.',
          data,
        });
    }
    return next(new errorResponse('Aranılan ilan bulunamadı!', 400));
  } catch (err) {
    return next(new errorResponse('İlan Arama işlemi başarısız!', 403));
  }
};

module.exports = {
  addAdvert,
  getAdvert,
  getAdverts,
  updateAdvert,
  deleteAdvert,
  searchAdvert,
};
