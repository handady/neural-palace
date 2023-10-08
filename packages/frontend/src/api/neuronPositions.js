import request from "@/router/axios-config.js";

// 更新original_knowledge
export const updateOriginalKnowledge = (data) => {
  return request({
    url: "/api/neuronPositions/updateOriginalKnowledge",
    method: "post",
    data,
  });
};

// 更新transformed_knowledge
export const updateTransformedKnowledge = (data) => {
  return request({
    url: "/api/neuronPositions/updateTransformedKnowledge",
    method: "post",
    data,
  });
};

// 获取内容图片列表
export const getContentImageList = (data) => {
  return request({
    url: "/api/neuronPositions/getContentImageList",
    method: "post",
    data,
  });
};

// 添加内容图片
export const addContentImage = (data) => {
  return request({
    url: "/api/neuronPositions/addContentImage",
    method: "post",
    data,
  });
};

// 删除内容图片
export const deleteContentImage = (data) => {
  return request({
    url: "/api/neuronPositions/deleteContentImage",
    method: "post",
    data
  });
}