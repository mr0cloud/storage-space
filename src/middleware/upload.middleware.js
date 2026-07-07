const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const ALLOWED_MIME_TYPES = [
    "image/png",
    "image/jpeg",
    "image/gif",
    "application/pdf",
    "text/plain",
    "application/zip",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "..", "uploads"));
    },
    filename: (req, file, cb) => {
        const uniqueName = `${crypto.randomUUID()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },

});

function fileFilter (req, file, cb){
    if(!ALLOWED_MIME_TYPES.includes(file.mimetype)){
        return cb(new Error("File type is not allowed"));
    }

    cb(null, true);
}

const upload = multer({
    storage,
    limits:{fileSize: MAX_FILE_SIZE},
    fileFilter,
});

function uploadSingleFile(fieldName) {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        req.fileValidationError = err.message;
      }
      next();
    });
  };
}


module.exports = upload;
module.exports.uploadSingleFile = uploadSingleFile;
