const multer = require('multer');
const inMemoryStorage = multer.memoryStorage();
const getStream = require('into-stream');
const { BlockBlobClient } = require('@azure/storage-blob');
const Jimp = require('jimp');
const errorResponse = require('./ErrorResponse');

const containerName = 'images';

const getBlobName = (originalName) => {
  const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
  return `${identifier}-${originalName}`;
};

const uploadStrategy = multer({
  storage: inMemoryStorage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(
        new errorResponse('Sadece resim dosyaları yükleyebilirsiniz', 400),
        false
      );
    }
  },
}).single('image');

async function uploadImage(file, next) {
  try {
    const blobName = getBlobName(file.originalname);
    const blobService = new BlockBlobClient(
      process.env.AZURE_STORAGE_CONNECTION_STRING,
      containerName,
      blobName
    );
    const streamLength = file.buffer.length;
    const maxSize = 10 * 1024; // 1mb
    if (streamLength > maxSize) {
      const image = await Jimp.read(file.buffer);
      const width = image.bitmap.width;
      // const height = image.bitmap.height;
      if(!width){
        return next(new errorResponse("Dosya okunamadı!",400));
      }
      image.resize(parseInt(width/2), Jimp.AUTO);
      const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
      const stream = getStream(buffer);
      const streamLength = buffer.length;
      await blobService.uploadStream(stream, streamLength);
      return {
        status: true,
        message: 'Başarılı bir şekilde yüklendi!',
        data:
          'https://birliktestorage.blob.core.windows.net/images/' + blobName,
      };
    } else {
      const stream = getStream(file.buffer);
      await blobService.uploadStream(stream, streamLength);
      return {
        status: true,
        message: 'Başarılı bir şekilde yüklendi!',
        data:
          'https://birliktestorage.blob.core.windows.net/images/' + blobName,
      };
    }
  } catch (err) {
    console.log(err)
    next(new errorResponse('Fotoğraf yükleme işleminiz başarısız!', 400));
    return {
      status: false,
      message: 'Fotoğraf yükleme işleminiz başarısız!',
      data: null,
    };
  }
}

module.exports = { uploadImage, uploadStrategy };
