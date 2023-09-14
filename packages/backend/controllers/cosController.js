const COS = require("cos-nodejs-sdk-v5");

// Initialize the COS instance
const cos = new COS({
  SecretId: process.env.SecretId,
  SecretKey: process.env.SecretKey,
});

// 创建一个函数来生成COS授权
const getCosAuthorization = () => {
  return cos.getAuthorization({
    Method: "put", // 上传操作使用PUT方法
    Key: "a.jpg", // 你的COS对象键
    Expires: 60, // 授权的有效期（以秒为单位）
    Query: {},
    Headers: {},
  });
};

// 处理文件上传到COS的函数
const uploadToCos = (req, res) => {
  const fileData = req.body.fileData; // 这是一个 Buffer 对象
  const authorization = getCosAuthorization();

  // 使用授权进行COS操作（例如上传文件）
  cos.putObject(
    {
      Bucket: "your-bucket-name",
      Region: "your-region",
      Key: "a.jpg",
      Body: fileData, // 要上传的文件数据
      ContentLength: fileData.length, // 文件的长度
      onProgress: function (progressData) {
        // 处理进度事件（如果需要的话）
      },
    },
    (err, data) => {
      if (err) {
        console.error("Error uploading to COS:", err);
        res.status(500).json({ message: "上传失败" });
      } else {
        console.log("File uploaded successfully:", data);
        res.status(200).json({ message: "上传成功" });
      }
    }
  );
};

// 导出控制器函数以供路由使用
module.exports = {
  uploadToCos,
  // 添加其他COS相关的控制器函数
};
