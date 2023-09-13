<template>
  <div>
    <h2>添加新节点</h2>
    <el-form
      ref="newNodeForm"
      :model="newNode"
      :rules="rules"
      label-width="52px"
    >
      <el-form-item label="名称" prop="id">
        <el-input v-model="newNode.id"></el-input>
      </el-form-item>
      <el-form-item label="分组" prop="group">
        <el-input v-model.number="newNode.group"></el-input>
      </el-form-item>
      <el-form-item label="材质" prop="material">
        <el-input v-model="newNode.material"></el-input>
      </el-form-item>
      <el-form-item label="封面" prop="coverImg">
        <el-input v-model="newNode.coverImg"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="contentImg">
        <el-input v-model="newNode.contentImg"></el-input>
      </el-form-item>
      <el-form-item label="颜色" prop="color">
        <el-input v-model="newNode.color"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="modifyNode">添加节点</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref } from "vue";
import { addNeuronNode } from "@/api/neuronNode";
import { ElMessage } from "element-plus";

export default {
  setup() {
    const newNode = ref({
      id: "",
      group: 0,
      material: "",
      coverImg: "",
      contentImg: "",
      color: "",
    });

    const rules = {
      id: [{ required: true, message: "请输入ID", trigger: "blur" }],
      group: [{ required: true, message: "请输入Group", trigger: "blur" }],
      material: [
        { required: true, message: "请输入Material", trigger: "blur" },
      ],
      coverImg: [
        { required: true, message: "请输入Cover Image URL", trigger: "blur" },
      ],
      contentImg: [
        { required: true, message: "请输入Content Image URL", trigger: "blur" },
      ],
      color: [{ required: true, message: "请输入Color", trigger: "blur" }],
    };

    const modifyNode = () => {
      this.$refs.newNodeForm.validate((valid) => {
        if (valid) {
          addNeuronNode(newNode.value).then((res) => {
            if (res.code === 200) {
              ElMessage({
                message: "添加成功",
                type: "success",
              });
              newNode.value = {
                id: "",
                group: 0,
                material: "",
                coverImg: "",
                contentImg: "",
                color: "",
              };
            }
          });
        } else {
          ElMessage.error("表单验证失败，请检查输入");
        }
      });
    };

    return {
      newNode,
      rules,
      modifyNode,
    };
  },
};
</script>
