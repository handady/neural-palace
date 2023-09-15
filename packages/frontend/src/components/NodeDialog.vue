<template>
  <div class="content">
    <el-form
      ref="newNodeForm"
      :model="newNode"
      :rules="rules"
      label-width="52px"
    >
      <el-row class="btns">
        <el-button type="primary" @click="goBack">返回</el-button>
        <el-button type="primary" @click="modifyNode">{{
          modifyType === "add" ? "添加" : "修改"
        }}</el-button>
      </el-row>
      <el-form-item label="名称" prop="id">
        <el-input v-model="newNode.id"></el-input>
      </el-form-item>
      <el-form-item label="分组" prop="group">
        <el-input v-model.number="newNode.group"></el-input>
      </el-form-item>
      <el-form-item label="材质" prop="material">
        <el-input v-model="newNode.material"></el-input>
      </el-form-item>
      <el-form-item label="封面">
        <Upload
          :imgUrl="coverImgUrl"
          :imgName="nodeInfo.coverImg"
          :imgType="'cover'"
          @uploadSuccessCover="uploadSuccessCover"
        ></Upload>
      </el-form-item>
      <el-form-item label="内容">
        <Upload
          :imgUrl="contentImgUrl"
          :imgName="nodeInfo.contentImg"
          :imgType="'content'"
          @uploadSuccessContent="uploadSuccessContent"
        ></Upload>
      </el-form-item>
      <el-form-item label="颜色" prop="color" style="margin-bottom: 0">
        <el-input v-model="newNode.color"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { addNeuronNode, updateNeuronNode } from "@/api/neuronNode";
import { ElMessage } from "element-plus";
import Upload from "@/components/Upload.vue";

export default {
  name: "NodeDialog",
  props: ["nodeInfo", "modifyType", "coverImgUrl", "contentImgUrl"],
  components: { Upload },
  setup(props, { emit }) {
    const newNodeForm = ref(null);
    const newNode = ref({
      id: "",
      group: 0,
      material: "",
      coverImg: "",
      contentImg: "",
      color: "",
    });

    onMounted(() => {
      if (props.modifyType === "edit") {
        newNode.value = { ...props.nodeInfo };
      }
    });

    const rules = {
      id: [{ required: true, message: "请输入ID", trigger: "blur" }],
      group: [{ required: true, message: "请输入Group", trigger: "blur" }],
      material: [
        { required: true, message: "请输入Material", trigger: "blur" },
      ],
      contentImg: [
        { required: true, message: "请输入Content Image URL", trigger: "blur" },
      ],
      color: [{ required: true, message: "请输入Color", trigger: "blur" }],
    };

    // 处理响应
    const handleResponse = (res, message) => {
      if (res.code === 200) {
        ElMessage({ message, type: "success" });
        emit("modifySuccess");
        if (props.modifyType === "add") {
          newNode.value = {
            id: "",
            group: 0,
            material: "",
            coverImg: "",
            contentImg: "",
            color: "",
          };
        }
      }
    };
    // 添加或修改节点
    const modifyNode = () => {
      newNodeForm.value.validate((valid) => {
        if (!valid) return ElMessage.error("表单验证失败，请检查输入");

        const isEdit = props.modifyType === "edit";
        const apiCall = isEdit ? updateNeuronNode : addNeuronNode;
        const message = isEdit ? "修改成功" : "添加成功";
        const payload = isEdit
          ? { ...newNode.value, originId: props.nodeInfo.id }
          : newNode.value;

        apiCall(payload).then((res) => handleResponse(res, message));
      });
    };

    // 封面图片上传成功
    const uploadSuccessCover = (res) => {
      newNode.value.coverImg = res;
    };
    // 内容图片上传成功
    const uploadSuccessContent = (res) => {
      newNode.value.contentImg = res;
    };

    // 返回
    const goBack = () => {
      emit("goBack");
    };

    return {
      newNode,
      rules,
      modifyNode,
      goBack,
      newNodeForm,
      uploadSuccessCover,
      uploadSuccessContent,
    };
  },
};
</script>

<style scoped>
.content {
  padding: 10px;
  width: 100%;
  height: 100%;
}
.btns {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}
</style>
