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
