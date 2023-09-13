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

// 删除节点
export const deleteNeuronNode = (id) => {
  return request({
    url: "/api/neuronNode/deleteNode",
    method: 'post',
    data: {
      id
    }
  })
}

// 修改节点
export const updateNeuronNode = (data) => {
  return request({
    url: "/api/neuronNode/updateNode",
    method: 'post',
    data
  })
}

