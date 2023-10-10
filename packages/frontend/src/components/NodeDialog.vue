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
        <el-select v-model="newNode.material" placeholder="请选择材质">
          <el-option
            v-for="option in materialOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="封面" prop="coverImg">
        <Upload
          :imgUrl="modifyType === 'edit' ? coverImgUrl : null"
          :imgName="nodeInfo.coverImg"
          :imgType="'cover'"
          @uploadSuccessCover="uploadSuccessCover"
        ></Upload>
      </el-form-item>
      <el-form-item label="内容" prop="contentImg">
        <Upload
          :imgUrl="modifyType === 'edit' ? contentImgUrl : null"
          :imgName="nodeInfo.contentImg"
          :imgType="'content'"
          @uploadSuccessContent="uploadSuccessContent"
        ></Upload>
      </el-form-item>
      <el-form-item label="颜色" prop="color" style="margin-bottom: 0">
        <el-color-picker
          v-model="newNode.color"
          :predefine="predefinedColors"
        ></el-color-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { addNeuronNode, updateNeuronNode } from "@/api/neuronNode";
import { addNeuronLink, updateNeuronLink } from "@/api/neuronLink";
import { ElMessage } from "element-plus";
import Upload from "@/components/Upload.vue";
import {
  MATERIAL_OPTIONS,
  PREDEFINED_COLORS,
} from "@/configs/constantsConfigs";

export default {
  name: "NodeDialog",
  props: ["nodeInfo", "modifyType", "coverImgUrl", "contentImgUrl"],
  components: { Upload },
  setup(props, { emit }) {
    const newNodeForm = ref(null);
    const materialOptions = MATERIAL_OPTIONS;
    const predefinedColors = PREDEFINED_COLORS;
    const isEdit = props.modifyType === "edit";
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
      coverImg: [
        { required: true, message: "请输入Cover Image URL", trigger: "blur" },
      ],
      contentImg: [
        { required: true, message: "请输入Content Image URL", trigger: "blur" },
      ],
      color: [{ required: true, message: "请输入Color", trigger: "blur" }],
    };

    // 处理响应
    const handleResponse = async (res, message) => {
      if (res.code === 200) {
        ElMessage({ message, type: "success" });
        return true;
      }
      return false;
    };

    // 重置 newNode
    const resetNewNode = () => {
      newNode.value = {
        id: "",
        group: 0,
        material: "",
        coverImg: "",
        contentImg: "",
        color: "",
      };
    };

    const modifyNode = async () => {
      try {
        const valid = await newNodeForm.value.validate();
        if (!valid) return ElMessage.error("操作失败");

        const isUpdate = Boolean(isEdit);
        const operation = isUpdate ? "修改" : "添加";
        const apiCall = isUpdate ? updateNeuronNode : addNeuronNode;
        const linkCall = isUpdate ? updateNeuronLink : addNeuronLink;

        const payload = {
          ...newNode.value,
          originId: isUpdate ? props.nodeInfo.id : undefined,
        };

        const cachedId = newNode.value.id; // 缓存 ID

        const nodeIdRes = await apiCall(payload);
        const isSuccess = await handleResponse(nodeIdRes, `${operation}成功`);

        if (!isSuccess) return;

        if (!isUpdate) resetNewNode();

        const linkPayload = isUpdate
          ? { originId: props.nodeInfo.id, currentId: cachedId }
          : { source: props.nodeInfo.id, target: cachedId, value: 1 };

        const linkRes = await linkCall(linkPayload);

        if (linkRes /* 判断成功 */) emit("modifySuccess");
      } catch (error) {
        ElMessage({ message: "操作失败", type: "error" });
      }
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
      materialOptions,
      predefinedColors,
    };
  },
};
</script>

<style scoped>
.content {
  padding: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btns {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}
</style>
