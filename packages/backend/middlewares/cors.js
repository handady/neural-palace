const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:8080", // 仅允许这个域的请求
  optionsSuccessStatus: 204,
};

module.exports = cors(corsOptions);
