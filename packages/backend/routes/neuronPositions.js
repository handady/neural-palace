const express = require("express");
const router = express.Router();
const connection = require("../db/mysqlConnection"); // 导入连接

// 更新node_positions表里面的transformed_knowledge字段,根据id和position_index联合主键
router.post("/updateTransformedKnowledge", (req, res) => {
  const { id, position_index, transformedKnowledge } = req.body;
  const sql =
    "UPDATE node_positions SET transformed_knowledge = ? WHERE id = ? AND position_index = ?";
  connection.query(
    sql,
    [transformedKnowledge, id, position_index],
    (err, result) => {
      if (err) res.standard(500, null, err);
      else res.standard(200, { id }, "编辑成功");
    }
  );
});

// 更新node_positions表里面的origin_knowledge字段,根据id和position_index联合主键
router.post("/updateOriginalKnowledge", (req, res) => {
  const { id, position_index, originalKnowledge } = req.body;
  const sql =
    "UPDATE node_positions SET original_knowledge = ? WHERE id = ? AND position_index = ?";
  connection.query(
    sql,
    [originalKnowledge, id, position_index],
    (err, result) => {
      if (err) res.standard(500, null, err);
      else res.standard(200, { id }, "编辑成功");
    }
  );
});

module.exports = router;
