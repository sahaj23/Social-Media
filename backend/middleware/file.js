

const multer=require('multer')

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
  };
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime type");
      if (isValid) {
        error = null;
      }
      cb(error, "../backend/images");
    },
    filename: (req, file, cb) => {
      const name = file.originalname
        .toLowerCase()
        .split(" ")
        .join("-");
        const n=name.split('.').slice(0, -1).join('.');
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, n + "-" + Date.now() + "." + ext);
    }
  });

  module.exports=multer({ storage: storage }).single("image")