<template>
  <el-upload
    ref="upload"
    class="upload-demo"
    action="http://localhost:5201/api/cos/upload"
    :limit="1"
    :on-exceed="handleExceed"
    :auto-upload="true"
  >
    <template #trigger>
      <el-button type="primary">选择文件</el-button>
    </template>
  </el-upload>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const upload = ref(null);

    const handleExceed = (files) => {
      upload.value.clearFiles();
      const file = files[0];
      upload.value.handleStart(file);
    };

    return {
      upload,
      handleExceed,
    };
  },
};
</script>

<style scoped>
.upload-demo{
    background-color: red;
    display: flex;
    justify-content: flex-start;
}
</style>
