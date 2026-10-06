const fs = require("fs");
const path = require("path");

// saves the uploaded image in the uploads folder and returns its link
const savePhoto = async (file, req) => {
  const fileName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
  const filePath = path.join(__dirname, "..", "uploads", fileName);

  fs.writeFileSync(filePath, file.buffer);

  return `${req.protocol}://${req.get("host")}/uploads/${fileName}`;
};

module.exports = savePhoto;
