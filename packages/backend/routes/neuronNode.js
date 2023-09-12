const express = require("express");
const router = express.Router();
const connection = require("../db/mysqlConnection"); // 导入连接

// 获取所有神经元节点
router.get("/", (req, res) => {
  connection.query("SELECT * FROM nodes", (err, rows) => {
    if (err) res.standard(500, null, err);
    else res.standard(200, rows, "获取成功");
  });
});

module.exports = router;