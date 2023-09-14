const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { uploadToCos } = require('../controllers/cosController.js');

router.post('/upload', upload.single('file'), (req, res) => {
  const fileData = req.file.buffer; // 这里拿到的是一个 Buffer，不是 JSON 对象
  req.body.fileData = fileData;
  // uploadToCos(req, res);
});

module.exports = router;