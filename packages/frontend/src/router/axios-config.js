// 全局配置axios请求
import axios from "axios";

// 默认超时时间
axios.defaults.timeout = 60000;
// base url设置
axios.defaults.baseURL = "http://localhost:5201";

// http request 拦截器
axios.interceptors.request.use(
  (config) => {
    config.headers = {
      "Content-Type": "application/json;charset=UTF-8",
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// http response 拦截器
axios.interceptors.response.use((res) => {
  //获取状态码
  const status = res.data.code || res.status;
  const message = res.data.msg || res.data.error_description || "未知错误";
  // 处理status状态码
  if (status === 401) {
    // 登录失效
    console.log("登录失效");
  } else if (status === 403) {
    // 没有权限
    console.log("没有权限");
  } else if (status === 500) {
    // 服务端错误
    console.log("服务端错误");
  } else if (status !== 200) {
    // 服务端返回的其他错误
    console.log(message);
  } else {
    // 成功
    return res.data;
  }
  return Promise.reject(new Error(message));
});

export default axios;
