const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { uploadToCos, getFromCos } = require('../controllers/cosController.js');

// 上传文件
router.post('/upload', upload.single('file'), (req, res) => {
  const fileData = req.file.buffer; // 这里拿到的是一个 Buffer，不是 JSON 对象
  req.body.fileData = fileData;
  req.body.fileName = req.file.originalname;
  uploadToCos(req, res);
});

// 下载文件
router.post('/getObject', (req, res) => {
  getFromCos(req, res);
});

module.exports = router;