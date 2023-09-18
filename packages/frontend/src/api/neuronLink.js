import request from "@/router/axios-config.js";

// 获取节点连接线
export const getNeuronLink = () => {
  return request({
    url: "/api/neuronLink",
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
