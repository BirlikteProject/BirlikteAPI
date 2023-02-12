const UserService = require('../services/UserService');
const errorResponse = require('../scripts/utils/ErrorResponse');

const getProfile = async (req, res, next) => {
  try {
    // ! sadece id ye göre mi ? , username'de olacak mı ?
    const { id } = req.params;
    // * başkasının profilini görüntüleyecek.
    if (id) {
      const select = ['fullName', 'image_url', 'username'];

      // ! username, fullName veya image_url yoksa nasıl bir aksiyon alınacak belirle!
      const user = await UserService.findById(id, select);
      if (!user) {
        return next(new errorResponse('Profil bulunamadı!',404));
      }
      return res.status(200).json({
        status: true,
        message: 'Profil başarıyla getirildi!',
        data: user,
      });
    } else {
      // ! kendi profilinde neler görüntüleyecek ?
      let user = req.user;
      user.tckn=undefined
      delete user.tckn;

      return res.status(200).json({
        status: true,
        message: 'Profil başarıyla getirildi!',
        data: user,
      });
    }
  } catch (err) {
    next(new errorResponse('Profil getirilemedi!',403));
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const id = user?._id; // * token'den gelen
    // ! neler değiştirilebilir ?
    const { fullName, image_url, type, username, city_id, phone, about, tckn } =
      req.body;
    // ! image_url yerine upload image olacak o değiştirildin mi değiştirilecek , multer s3 veya nereye yüklenecekse oraya göre düzenle

    const data = {
      fullName,
      image_url,
      type,
      username,
      city_id,
      phone,
      about,
      tckn, // ! tckn şifrelenebilir
    };
    const updatedProfile = await UserService.update(id, data);

    if (!updatedProfile) {
      return next(new errorResponse('Profil güncellenemedi', 401));
    }

    updatedProfile.tckn=undefined;
    delete updatedProfile.tckn;
    return res.status(200).json({
      status: true,
      message: 'Profil başarıyla güncellendi',
      data: updatedProfile,
    });
  } catch (err) {
    next(new errorResponse('Profil güncellenemedi!',403) );
  }
};
module.exports = { getProfile, updateProfile };
