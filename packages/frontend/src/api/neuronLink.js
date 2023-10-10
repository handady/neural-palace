import request from "@/router/axios-config.js";

// 获取节点连接线
export const getNeuronLink = () => {
  return request({
    url: "/api/neuronLink/getLink",
    method: "get",
  });
};

// 添加节点连接线
export const addNeuronLink = (data) => {
  return request({
    url: "/api/neuronLink/addLink",
    method: "post",
    data,
  });
};

// 删除节点连接线
export const deleteNeuronLink = (id) => {
  return request({
    url: "/api/neuronLink/deleteLink",
    method: "post",
    data: {
      id,
    },
  });
};

// 修改节点连接线
export const updateNeuronLink = (data) => {
  return request({
    url: "/api/neuronLink/updateLink",
    method: "post",
    data,
  });
};

// 连接两个节点
export const connectNeuronLink = (data) => {
  return request({
    url: "/api/neuronLink/connectLink",
    method: "post",
    data,
  });
}

// 删除两个节点的连接
export const disconnectNeuronLink = (data) => {
  return request({
    url: "/api/neuronLink/disconnectLink",
    method: "post",
    data,
  });
}