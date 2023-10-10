import request from "@/router/axios-config.js";

// 获取节点
export const getNeuronNode = () => {
  return request({
    url: "/api/neuronNode/getNode",
    method: "get",
  });
};

// 添加节点
export const addNeuronNode = (data) => {
  return request({
    url: "/api/neuronNode/addNode",
    method: "post",
    data,
  });
};

// 删除节点
export const deleteNeuronNode = (id) => {
  return request({
    url: "/api/neuronNode/deleteNode",
    method: "post",
    data: {
      id,
    },
  });
};

// 修改节点
export const updateNeuronNode = (data) => {
  return request({
    url: "/api/neuronNode/updateNode",
    method: "post",
    data,
  });
};

// 提交节点内容
export const submitNeuronNodeContent = (data) => {
  return request({
    url: "/api/neuronNode/submitNodeContent",
    method: "post",
    data,
  });
};

// 获取节点内容
export const getNeuronNodeContent = (id) => {
  return request({
    url: "/api/neuronNode/getNodeContent",
    method: "post",
    data: {
      id,
    },
  });
}

// 模糊查询nodes的id
export const getNeuronNodeIds = (data) => {
  return request({
    url: "/api/neuronNode/getNeuronNodeIds",
    method: "post",
    data,
  });
}