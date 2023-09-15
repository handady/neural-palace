import request from "@/router/axios-config.js";

// 上传对象
export const uploadObject = (file) => {
  const formData = new FormData();

  return request({
    url: "/api/cos/upload",
    method: "post",
    headers: { "Content-Type": "multipart/form-data" },
    data: formData,
  });
};

// 获取对象
export const getObject = (data) => {
  return request({
    url: "/api/cos/getObject",
    method: "post",
    data,
  });
};
