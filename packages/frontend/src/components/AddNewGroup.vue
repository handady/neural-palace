<template>
  <div class="content">
    <el-form
      ref="newNodeForm"
      :model="newNode"
      :rules="rules"
      label-width="52px"
    >
      <el-row class="btns">
        <el-button type="primary" @click="cancel">取消</el-button>
        <el-button type="primary" @click="modifyNode">添加</el-button>
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
          :imgType="'cover'"
          @uploadSuccessCover="uploadSuccessCover"
        ></Upload>
      </el-form-item>
      <el-form-item label="内容" prop="contentImg">
        <Upload
          :imgType="'content'"
          @uploadSuccessContent="uploadSuccessContent"
        ></Upload>
      </el-form-item>
      <el-form-item label="颜色" prop="color">
        <el-color-picker
          v-model="newNode.color"
          :predefine="predefinedColors"
        ></el-color-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref } from "vue";
import { addNeuronNode } from "@/api/neuronNode";
import { ElMessage } from "element-plus";
import {
  MATERIAL_OPTIONS,
  PREDEFINED_COLORS,
} from "@/configs/constantsConfigs";
import Upload from "./Upload.vue";

export default {
  name: "addNewGroup",
  components: {
    Upload,
  },
  setup(props, { emit }) {
    const newNodeForm = ref(null);
    const materialOptions = MATERIAL_OPTIONS;
    const predefinedColors = PREDEFINED_COLORS;
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
      coverImg: [
        { required: true, message: "请输入Cover Image URL", trigger: "blur" },
      ],
      contentImg: [
        { required: true, message: "请输入Content Image URL", trigger: "blur" },
      ],
      color: [{ required: true, message: "请输入Color", trigger: "blur" }],
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
        const nodeIdRes = await addNeuronNode(newNode.value);
        if (nodeIdRes.code === 200) {
          ElMessage({ message: "添加成功", type: "success" });
          emit("cancel");
          emit("modifySuccess");
        }
      } catch (error) {
        ElMessage({ message: "添加失败", type: "error" });
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

    const cancel = () => {
      emit("cancel");
    };

    return {
      newNode,
      rules,
      modifyNode,
      newNodeForm,
      materialOptions,
      predefinedColors,
      resetNewNode,
      uploadSuccessCover,
      uploadSuccessContent,
      cancel,
    };
  },
};
</script>

<style scoped>
.content {
  padding: 10px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  backface-visibility: hidden;
  position: absolute;
  transition: transform 0.6s linear;
  border-radius: 5%;
  background-color: #fff;
  box-shadow: 0px 15px 30px 0px rgba(254, 158, 181, 0.6),
    inset 0px -5px 16px 0px rgba(254, 158, 181, 0.7),
    inset 0px 11px 28px 0px rgb(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}
.btns {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}
</style>
