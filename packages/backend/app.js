const express = require("express");
const app = express();
const port = 5201;

// 使用 Express 内建中间件
app.use(express.json({ limit: "50mb" })); // 用于解析 JSON 负载
app.use(express.urlencoded({ limit: "50mb", extended: true })); // 用于解析 URL 编码的负载
app.use(express.static("public")); // 静态文件服务

// 中间件
// 跨域
const cors = require("./middlewares/cors");
app.use(cors);
// 标准响应
const standardResponse = require("./middlewares/standardResponse");
app.use(standardResponse);

// 路由
const mainRoutes = require("./routes");
app.use("/api", mainRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
