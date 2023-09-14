const express = require('express');
const router = express.Router();
const { uploadToCos } = require('../controllers/cosController.js');

// 定义上传对象到COS的路由
router.post('/upload', (req, res) => {
  uploadToCos(req, res);
});

module.exports = router;