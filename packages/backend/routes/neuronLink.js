const express = require("express");
const router = express.Router();
const connection = require("../db/mysqlConnection"); // 导入连接

// 获取所有节点连接线
router.get("/", (req, res) => {
  connection.query("SELECT * FROM links", (err, rows) => {
    if (err) res.standard(500, null, err);
    else res.standard(200, rows, "获取成功");
  });
});

// 添加节点连接线
router.post("/addLink", (req, res) => {
  const { source, target, value } = req.body;

  const sql = "INSERT INTO links (source, target, value) VALUES (?, ?, ?)";

  connection.query(sql, [source, target, value], (err, result) => {
    if (err) res.standard(500, null, err);
    else res.standard(200, { id: result.insertId }, "节点连接线添加成功");
  });
});

// 删除节点连接线
router.post("/deleteLink", (req, res) => {
  const { id } = req.body;

  // 首先查询是否存在target=id的记录
  const checkSql = "SELECT COUNT(*) AS count FROM links WHERE target = ?";
  connection.query(checkSql, [id], (err, result) => {
    if (err) {
      res.standard(500, null, err);
      return;
    }

    // 如果target字段中有该id
    if (result[0].count > 0) {
      const deleteTargetSql = "DELETE FROM links WHERE target = ?";
      connection.query(deleteTargetSql, [id], (err, result) => {
        if (err) res.standard(500, null, err);
        else res.standard(200, { id }, "节点连接线删除成功");
      });
    } else {
      // 如果target字段中没有该id，删除source字段中的id
      const deleteSourceSql = "DELETE FROM links WHERE source = ?";
      connection.query(deleteSourceSql, [id], (err, result) => {
        if (err) res.standard(500, null, err);
        else res.standard(200, { id }, "节点连接线删除成功");
      });
    }
  });
});

// 修改节点连接线
router.post("/updateLink", (req, res) => {
  const { id, source, target, value, originId } = req.body;

  const sql =
    "UPDATE links SET source = ?, target = ?, value = ?, id = ? WHERE id = ?";

  connection.query(
    sql,
    [source, target, value, id, originId],
    (err, result) => {
      if (err) res.standard(500, null, err);
      else res.standard(200, { id }, "节点连接线修改成功");
    }
  );
});

module.exports = router;