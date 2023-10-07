const express = require("express");
const router = express.Router();
const connection = require("../db/mysqlConnection"); // 导入连接
require("dotenv").config();
const COS = require("cos-nodejs-sdk-v5");

// Initialize the COS instance
const cos = new COS({
  SecretId: process.env.COS_SECRET_ID,
  SecretKey: process.env.COS_SECRET_KEY,
});

const getObjectUrlPromise = (filePath) => {
  return new Promise((resolve, reject) => {
    cos.getObjectUrl(
      {
        Bucket: process.env.COS_BUCKET_NAME,
        Region: process.env.COS_REGION,
        Key: filePath,
        Sign: true,
        Expires: 5000,
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Url);
        }
      }
    );
  });
};

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
    "SELECT contentImg, contentImg2, contentImg3, contentImg4, contentImg5 FROM nodes WHERE id = ?";
  connection.query(sql, [id], (err, rows) => {
    if (err) {
      res.standard(500, null, err);
    } else {
      if (rows && rows.length > 0) {
        const images = Object.values(rows[0]).filter((img) => img !== null);

        // 对每个图片都调用cos.getObjectUrl
        const promises = images.map(getObjectUrlPromise);
        Promise.all(promises)
          .then((urls) => {
            res.standard(200, urls, "获取成功");
          })
          .catch((err) => {
            res.standard(500, null, err);
          });
      } else {
        res.standard(200, [], "无数据");
      }
    }
  });
});

module.exports = router;
