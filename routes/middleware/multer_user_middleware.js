const multer = require('multer');
// const uuid = require('uuid');
const { v4: uuidv4 } = require('uuid');
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const multer_user_middleware = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `public/uploads/images/users`);
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      // cb(null, req.params.courseId + '_courseImage' + '.' + ext);
      cb(null, file.fieldname + '_' + uuidv4() + '.' + ext);
    }
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type!');
    cb(error, isValid);
  }
});
0
module.exports = multer_user_middleware;
