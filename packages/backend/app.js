const express = require('express');
const app = express();
const port = 5201;

// 中间件
// 跨域
const cors = require('./middlewares/cors');
app.use(cors);
// 标准响应
const standardResponse = require('./middlewares/standardResponse');
app.use(standardResponse);

// 路由
const mainRoutes = require('./routes');
app.use('/api', mainRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});