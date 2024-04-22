const uploadToCloudinary = require("../utils/uploadToCloudinary");

module.exports.upload = async (req, res, next) => {
  if(req.file) {
    const link = await uploadToCloudinary(req.file.buffer);
    req.body[req.file.fieldname] = link;
  }

  next();
}