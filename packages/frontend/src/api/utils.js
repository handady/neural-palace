import request from "@/router/axios-config.js";

// 上传对象
export const uploadObject = (data) => {
  return request({
    url: "/api/cos/upload",
    method: "post",
    data,
  });
};
