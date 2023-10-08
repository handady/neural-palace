<template>
  <!-- Add Dialog with Image Upload -->
  <el-dialog
    v-model="state.showAddDialog"
    title="新增图片"
    @close="closeDialog"
  >
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
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="confirm('add')">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- Delete Dialog -->
  <el-dialog
    v-model="state.showDeleteDialog"
    title="删除图片"
    @close="closeDialog"
  >
    <span>确定要删除这张图片吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.showDeleteDialog = false">取消</el-button>
        <el-button type="primary" @click="confirm('delete')">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, reactive, watch } from "vue";
import Upload from "@/components/Upload.vue";
import { ElMessage } from "element-plus";
import { addContentImage, deleteContentImage } from "@/api/neuronPositions";

export default {
  name: "EditDialog",
  components: {
    Upload,
  },
  props: ["dialogType", "contentId", "contentIndex", "activeContentIndex", "contentImgId"],
  setup(props, { emit }) {
    const state = reactive({
      showAddDialog: false,
      showDeleteDialog: false,
    });
    const upload = ref(null);
    const fileList = ref([]); // 新增这一行，用于存储文件列表
    const fileLocation = ref("");

    // Watch the dialogType prop for changes
    watch(
      () => props.dialogType,
      (newValue, oldValue) => {
        if (newValue === "add") {
          state.showAddDialog = true;
          state.showDeleteDialog = false;
        } else if (newValue === "delete") {
          state.showAddDialog = false;
          state.showDeleteDialog = true;
        }
      },
      { immediate: true } // This ensures the watcher runs immediately upon component setup
    );

    const handleSuccess = (res, file) => {
      fileLocation.value = "https://" + res.data.fileLocation;
    };

    const handleBeforeUpload = (file) => {
      upload.value.clearFiles(); // 清除现有文件
      fileList.value = []; // 清空 fileList
      fileList.value.push(file); // 添加新文件
    };

    const closeDialog = () => {
      // Send an event to the parent to set dialogType to null
      emit("update:dialogType", null);
    };

    const confirm = (confirmType) => {
      if (confirmType === "add") {
        if (props.contentIndex === 5) {
          // 提示用户，图片数量不能超过5张
          ElMessage.warning("图片数量不能超过5张");
          return;
        } else if (fileLocation.value === "") {
          ElMessage.warning("请选择图片");
          return;
        }
        addContentImage({
          contentIndex: props.contentIndex + 1,
          contentImage: fileLocation.value,
          contentId: props.contentId,
        }).then((res) => {
          if (res.code === 200) {
            ElMessage.success("图片上传成功");
            closeDialog();
            state.showAddDialog = false;
            emit("modifySuccess");
          } else {
            ElMessage.error("图片上传失败");
          }
        });
      } else if (confirmType === "delete") {
        if (props.contentIndex === 1) {
          // 提示用户，图片不能删除
          ElMessage.warning("至少保留一张图片");
          return;
        }
        deleteContentImage({
          contentIndex: props.activeContentIndex,
          contentId: props.contentId,
          contentImgId: props.contentImgId,
        }).then((res) => {
          if (res.code === 200) {
            ElMessage.success("图片删除成功");
            closeDialog();
            state.showDeleteDialog = false;
            emit("modifySuccess");
          } else {
            ElMessage.error("图片删除失败");
          }
        });
      }
    };

    return {
      state,
      closeDialog,
      fileList,
      fileLocation,
      handleSuccess,
      handleBeforeUpload,
      upload,
      confirm,
    };
  },
};
</script>

<style lang="scss" scoped>
.upload-demo {
  display: flex;
  justify-content: flex-start;
}
.upload-demo :deep(.el-upload-list) {
  flex: 1;
  margin: auto;
}
.upload-demo :deep(.el-upload-list .el-progress__text) {
  display: none;
}

.upload-demo :deep(.el-upload-list .el-upload-list__item) {
  margin-bottom: 0;
}
</style>
