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

// 获取内容图片列表，id在params里面
router.post("/getContentImageList", (req, res) => {
  const { id } = req.body;
  const sql =
    "SELECT contentImg1, contentImg2, contentImg3, contentImg4, contentImg5 FROM nodes WHERE id = ?";
  connection.query(sql, [id], (err, rows) => {
    if (err) {
      res.standard(500, null, err);
    } else {
      const result = [];
      rows.forEach((row) => {
        for (const value of Object.values(row)) {
          if (value !== null) {
            result.push(value);
          }
        }
      });
      res.standard(200, result, "获取成功");
    }
  });
});

// 增加内容图片
router.post("/addContentImage", (req, res) => {
  const { contentId, contentImage } = req.body;

  // SQL query to fetch all contentImg columns
  const fetchSql = `SELECT contentImg1, contentImg2, contentImg3, contentImg4, contentImg5 FROM nodes WHERE id = ?`;

  connection.query(fetchSql, [contentId], (err, results) => {
    if (err) {
      return res.standard(500, null, err);
    }

    if (results.length === 0) {
      return res.standard(404, null, "Content not found");
    }

    const row = results[0];
    let targetColumn = null;

    // Find the first empty column
    for (let i = 1; i <= 5; i++) {
      if (!row[`contentImg${i}`]) {
        targetColumn = `contentImg${i}`;
        break;
      }
    }

    if (!targetColumn) {
      return res.standard(400, null, "All columns are filled");
    }

    // SQL query to update the target column
    const updateSql = `UPDATE nodes SET ?? = ? WHERE id = ?`;

    connection.query(
      updateSql,
      [targetColumn, contentImage, contentId],
      (updateErr) => {
        if (updateErr) {
          return res.standard(500, null, updateErr);
        }

        res.standard(200, { contentId }, "编辑成功");
      }
    );
  });
});

// 删除内容图片
router.post("/deleteContentImage", (req, res) => {
  const { contentId, contentIndex, contentImgId } = req.body;

  const columnName = `contentImg${contentIndex}`;
  const sql = `UPDATE nodes SET ?? = NULL WHERE id = ?`;

  connection.query(sql, [columnName, contentId], (err, rows) => {
    if (err) {
      res.standard(500, null, err);
    } else {
      // 将node_positions表里面id为contentImgId的数据删除
      const deleteSql = `DELETE FROM node_positions WHERE id = ?`;

      connection.query(deleteSql, [contentImgId], (err, rows) => {
        if (err) {
          res.standard(500, null, err);
        } else {
          res.standard(200, { contentId }, "删除成功");
        }
      });
    }
  });
});

module.exports = router;
