import request from "@/router/axios-config.js";

// 上传对象
export const uploadObject = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);

  return request({
    url: "/api/cos/uploadFile",
    method: "post",
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
