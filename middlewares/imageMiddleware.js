const multer = require('multer');
const path = require('path');

module.exports = (req, res, next) => {
  // Настраиваем хранение файлов с помощью multer
  const storage = multer.memoryStorage();
  const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extname) {
      return cb(null, true);
    } else {
      return cb(new Error('Загруженный файл не является изображением.'));
    }
  };

  // Создаем multer middleware
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // Ограничение на размер файла: 10MB
  });

  // Middleware для загрузки нескольких изображений
  const uploadImagesMiddleware = upload.array('files', 10);

  // Используем middleware для загрузки файлов
  uploadImagesMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Обработка ошибок multer (например, превышение размера файла)
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Обработка других ошибок
      return res.status(400).json({ error: err.message });
    }

    // Если ошибок нет, продолжаем к следующему middleware
    next();
  });
};