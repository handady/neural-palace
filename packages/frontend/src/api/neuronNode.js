import request from "@/router/axios-config.js";

// 获取节点
export const getNeuronNode = () => {
  return request({
    url: "/api/neuronNode",
    method: "get",
  });
}

// 添加节点
export const addNeuronNode = (data) => {
  return request({
    url: "/api/neuronNode/addNode",
    method: 'post',
    data
  })
}