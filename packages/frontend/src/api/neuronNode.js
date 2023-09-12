import request from "@/router/axios-config.js";

// 获取节点
export const getNeuronNode = () => {
  return request({
    url: "api/neuronNode",
    method: "get",
  });
}