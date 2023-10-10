const express = require("express");
const router = express.Router();
const connection = require("../db/mysqlConnection"); // 导入连接

// 获取所有神经元节点
router.get("/getNode", (req, res) => {
  connection.query("SELECT * FROM nodes", (err, rows) => {
    if (err) res.standard(500, null, err);
    else res.standard(200, rows, "获取成功");
  });
});

// 添加节点
router.post("/addNode", (req, res) => {
  const { id, group, material, coverImg, contentImg, color } = req.body;

  const sql =
    "INSERT INTO nodes (id, `group`, material, coverImg, contentImg1, color) VALUES (?, ?, ?, ?, ?, ?)";

  connection.query(
    sql,
    [id, group, material, coverImg, contentImg, color],
    (err, result) => {
      if (err) res.standard(500, null, err);
      else res.standard(200, { id }, "节点添加成功");
    }
  );
});

function deleteNode(id, res) {
  const sql = "DELETE FROM nodes WHERE id = ?";
  connection.query(sql, [id], (err, result) => {
    if (err) res.standard(500, null, err);
    else res.standard(200, { id }, "节点删除成功");
  });
}

// 删除节点
router.post("/deleteNode", (req, res) => {
  const { id } = req.body;

  // 1. 首先查询节点的contentImg字段
  const selectSql =
    "SELECT contentImg1, contentImg2, contentImg3, contentImg4, contentImg5 FROM nodes WHERE id = ?";

  connection.query(selectSql, [id], (err, results) => {
    if (err) {
      return res.standard(500, null, err);
    }
    if (results.length === 0) {
      return res.standard(404, null, "节点不存在");
    }
    const row = results[0];

    // 2. 检查contentImg字段是否不为null
    const images = [
      "contentImg1",
      "contentImg2",
      "contentImg3",
      "contentImg4",
      "contentImg5",
    ];
    const nonNullImages = images.filter((img) => row[img] !== null);

    // 定义一个递归函数来处理所有非空的图片
    const deletePositionsRecursive = (images, callback) => {
      if (images.length === 0) return callback();

      const imageId = row[images[0]]; // 获取图片对应的ID
      const deletePositionsSql = "DELETE FROM node_positions WHERE id = ?";

      connection.query(deletePositionsSql, [imageId], (err2) => {
        if (err2) return callback(err2);

        // 继续处理下一个
        deletePositionsRecursive(images.slice(1), callback);
      });
    };

    deletePositionsRecursive(nonNullImages, (err3) => {
      if (err3) {
        return res.standard(500, null, err3);
      }
      // 3. 所有非空的图片都已处理，现在删除节点
      deleteNode(id, res);
    });
  });
});

// 修改节点
router.post("/updateNode", (req, res) => {
  const { id, group, material, coverImg, contentImg, color, originId } =
    req.body;

  const sql =
    "UPDATE nodes SET `group` = ?, material = ?, coverImg = ?, contentImg = ?, color = ?, id = ? WHERE id = ?";

  connection.query(
    sql,
    [group, material, coverImg, contentImg, color, id, originId],
    (err, result) => {
      if (err) res.standard(500, null, err);
      else res.standard(200, { id }, "节点修改成功");
    }
  );
});

// 提交节点内容
router.post("/submitNodeContent", (req, res) => {
  const data = req.body;
  const promises = data.map((item) => {
    return new Promise((resolve, reject) => {
      const { id, position_index, relativeX, relativeY } = item;
      const sql =
        "INSERT INTO node_positions (id, position_index, relativeX, relativeY) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE relativeX = VALUES(relativeX), relativeY = VALUES(relativeY)";
      connection.query(
        sql,
        [id, position_index, relativeX, relativeY],
        (err, result) => {
          if (err) reject(err);
          else resolve({ id, message: "节点内容提交成功" });
        }
      );
    });
  });

  Promise.all(promises)
    .then((results) => {
      res.standard(200, results, "所有节点内容提交成功");
    })
    .catch((err) => {
      res.standard(500, null, err);
    });
});

// 获取节点内容
router.post("/getNodeContent", (req, res) => {
  const { id } = req.body;

  const sql = "SELECT * FROM node_positions WHERE id = ?";
  connection.query(sql, [id], (err, rows) => {
    if (err) res.standard(500, null, err);
    else res.standard(200, rows, "获取成功");
  });
});

// 模糊查询nodes里面的id
router.post("/getNeuronNodeIds", (req, res) => {
  const { keyword } = req.body;

  const sql = `SELECT id FROM nodes WHERE id LIKE ?`;

  connection.query(sql, [`%${keyword}%`], (err, rows) => {
    if (err) res.standard(500, null, err);
    else res.standard(200, rows, "获取成功");
  });
});

module.exports = router;
