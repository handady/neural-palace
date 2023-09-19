<template>
  <el-upload
    ref="upload"
    class="upload-demo"
    action="http://localhost:5201/api/cos/upload"
    :auto-upload="true"
    :on-success="handleSuccess"
    :file-list="fileList"
    :before-upload="handleBeforeUpload"
    :on-remove="handleRemove"
  >
    <template #trigger>
      <el-button type="primary">选择文件</el-button>
    </template>
  </el-upload>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  props: ["imgUrl", "imgName", "imgType"],
  setup(props, { emit }) {
    const upload = ref(null);
    const fileList = ref([]); // 新增这一行，用于存储文件列表

    // 如果有默认文件 URL，则更新 fileList
    onMounted(() => {
      if (props.imgUrl) {
        fileList.value = [
          {
            name: props.imgName,
            status: "success",
            url: props.imgUrl,
          },
        ];
      }
    });

    const handleSuccess = (res, file) => {
      if (props.imgType === "cover") {
        emit("uploadSuccessCover", res.data);
      } else {
        emit("uploadSuccessContent", res.data);
      }
    };

    const handleBeforeUpload = (file) => {
      upload.value.clearFiles(); // 清除现有文件
      fileList.value = []; // 清空 fileList
      fileList.value.push(file); // 添加新文件
    };

    const handleRemove = (file) => {
      if (props.imgType === "cover") {
        emit("uploadSuccessCover", '');
      } else {
        emit("uploadSuccessContent", '');
      }
    };

    return {
      upload,
      handleSuccess,
      fileList,
      handleBeforeUpload,
      handleRemove,
    };
  },
};
</script>

<style scoped>
.upload-demo {
  display: flex;
  justify-content: flex-start;
}
.upload-demo :deep(.el-upload-list) {
  flex: 1;
  margin-top: 0;
}
.upload-demo :deep(.el-upload-list .el-progress__text) {
  display: none;
}

.upload-demo :deep(.el-upload-list .el-upload-list__item) {
  margin-bottom: 0;
}
</style>
