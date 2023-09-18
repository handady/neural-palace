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
        if (!isEdit) {
          newNode.value = {
            id: "",
            group: 0,
            material: "",
            coverImg: "",
            contentImg: "",
            color: "",
          };
        }
        return true; // 成功处理
      }
      return false; // 处理失败
    };

    // 添加或修改节点
    const modifyNode = async () => {
      newNodeForm.value.validate(async (valid) => {
        if (!valid) return ElMessage.error("操作失败");

        const apiCall = isEdit ? updateNeuronNode : addNeuronNode;
        const message = isEdit ? "修改成功" : "添加成功";
        const payload = isEdit
          ? { ...newNode.value, originId: props.nodeInfo.id }
          : newNode.value;

        const res1 = await apiCall(payload);
        const isSuccess = await handleResponse(res1, message);

        if (!isEdit && isSuccess) {
          const res2 = await addNeuronLink({
            source: props.nodeInfo.id,
            target: newNode.value.id,
            value: 1,
          });
          // 你可以选择处理 res2
          if (res2 /* 判断成功 */) {
            emit("modifySuccess");
          }
        } else if (isSuccess) {
          emit("modifySuccess");
        }
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
}
.btns {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}
</style>
