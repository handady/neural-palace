require("dotenv").config();
const COS = require("cos-nodejs-sdk-v5");

// Initialize the COS instance
const cos = new COS({
  SecretId: process.env.COS_SECRET_ID,
  SecretKey: process.env.COS_SECRET_KEY,
});

// 处理文件上传到COS的函数
const uploadToCos = (req, res) => {
  const fileData = req.body.fileData; // 这是一个 Buffer 对象
  const fileName = req.body.fileName; // 这是一个字符串
  const filePath = process.env.COS_PATH + fileName; // 这是一个字符串

  cos.putObject(
    {
      Bucket: process.env.COS_BUCKET_NAME,
      Region: process.env.COS_REGION,
      Key: filePath,
      StorageClass: "STANDARD",
      Body: fileData, // 要上传的文件数据
      onProgress: function (progressData) {
        // 处理进度事件（如果需要的话）
      },
    },
    (err, data) => {
      if (err) {
        console.error("Error uploading to COS:", err);
        res.standard(500, null, "上传失败");
      } else {
        console.log("File uploaded successfully:", data);
        res.standard(200, filePath, "上传成功");
      }
    }
  );
};

// 获取文件的COS操作
const getFromCos = (req, res) => {
  const filePath = req.body.filePath; // 这是一个字符串

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
        console.error("Error downloading from COS:", err);
        res.standard(500, null, "获取失败");
      } else {
        console.log("File downloaded successfully:", data);
        res.standard(200, data.Url, "获取成功");
      }
    }
  );
};

// 导出控制器函数以供路由使用
module.exports = {
  uploadToCos,
  getFromCos,
};
