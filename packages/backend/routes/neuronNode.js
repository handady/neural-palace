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

// 添加节点
router.post('/addNode', (req, res) => {
  const { id, group, material, coverImg, contentImg, color } = req.body;

  const sql = 'INSERT INTO nodes (id, `group`, material, coverImg, contentImg, color) VALUES (?, ?, ?, ?, ?, ?)';

  connection.query(sql, [id, group, material, coverImg, contentImg, color], (err, result) => {
    if (err) res.standard(500, null, err);
    else res.standard(200, { id }, '节点添加成功');
  });
});

// 删除节点
router.post('/deleteNode', (req, res) => {
  const { id } = req.body;

  const sql = 'DELETE FROM nodes WHERE id = ?';

  connection.query(sql, [id], (err, result) => {
    if (err) res.standard(500, null, err);
    else res.standard(200, { id }, '节点删除成功');
  });
});

// 修改节点
router.post('/updateNode', (req, res) => {
  const { id, group, material, coverImg, contentImg, color } = req.body;

  const sql = 'UPDATE nodes SET `group` = ?, material = ?, coverImg = ?, contentImg = ?, color = ? WHERE id = ?';

  connection.query(sql, [group, material, coverImg, contentImg, color, id], (err, result) => {
    if (err) res.standard(500, null, err);
    else res.standard(200, { id }, '节点修改成功');
  });
});

module.exports = router;