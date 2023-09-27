const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const { uploadToCos, getFromCos } = require("../controllers/cosController.js");

// 获取当前时间
const formatDate = () => {
  const date = new Date();
  const year = date.getFullYear().toString().padStart(4, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");

  return `${year}${month}${day}${hour}${minute}${second}`;
};

// 上传文件--element ui
router.post("/upload", upload.single("file"), (req, res) => {
  const fileData = req.file.buffer;
  const originalName = req.file.originalname;
  const ext = originalName.split(".").pop();
  const nameWithoutExt = originalName.substring(
    0,
    originalName.length - ext.length - 1
  );

  const formattedDate = formatDate();
  const newFileName = `${nameWithoutExt}_${formattedDate}.${ext}`;

  req.body.fileData = fileData;
  req.body.fileName = newFileName;
  uploadToCos(req, res);
});

// 上传文件--自制组件
router.post("/uploadFile", upload.single("file"), (req, res) => {
  const fileData = req.file.buffer; // 这里拿到的是一个 Buffer，不是 JSON 对象
  const originalName = req.file.originalname;
  const ext = originalName.split(".").pop();
  const nameWithoutExt = originalName.substring(
    0,
    originalName.length - ext.length - 1
  );

  const formattedDate = formatDate();
  const newFileName = `${nameWithoutExt}_${formattedDate}.${ext}`;

  req.body.fileData = fileData;
  req.body.fileName = newFileName;
  uploadToCos(req, res);
});

// 下载文件
router.post("/getObject", (req, res) => {
  getFromCos(req, res);
});

module.exports = router;
