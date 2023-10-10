<template>
  <el-dialog v-model="showConnectDialog" title="操作连接" @close="closeDialog">
    <el-form label-position="right" label-width="120px">
      <!-- Source Neuron -->
      <el-form-item label="源神经元">
        <el-select
          v-model="selectedSource"
          filterable
          remote
          :loading="loading"
          :remote-method="debouncedSearch"
          placeholder="请选择或输入源神经元"
        >
          <el-option
            v-for="neuron in searchResults"
            :key="neuron.id"
            :label="neuron.id"
            :value="neuron.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- Target Neuron -->
      <el-form-item label="目标神经元">
        <el-select
          v-model="selectedTarget"
          filterable
          remote
          :loading="loading"
          :remote-method="debouncedSearch"
          placeholder="请选择或输入目标神经元"
        >
          <el-option
            v-for="neuron in searchResults"
            :key="neuron.id"
            :label="neuron.id"
            :value="neuron.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="connectNeurons">连接</el-button>
      <el-button type="danger" @click="disconnectNeurons">断开</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { reactive, ref } from "vue";
import { debounce } from "lodash";
import { getNeuronNodeIds } from "@/api/neuronNode";
import { connectNeuronLink, disconnectNeuronLink } from "@/api/neuronLink";
import { ElMessage } from "element-plus";

export default {
  name: "ConnectDialog",
  props: ["showConnectDialog"],
  emits: ["update:showConnectDialog", "modifySuccess"],
  setup(props, { emit }) {
    const searchResults = reactive([]);
    const loading = ref(false);
    const selectedSource = ref(null);
    const selectedTarget = ref(null);

    const searchNeurons = (query) => {
      loading.value = true;
      getNeuronNodeIds({
        keyword: query,
      }).then((response) => {
        searchResults.splice(0, searchResults.length, ...response.data);
        loading.value = false;
      });
    };

    const debouncedSearch = debounce(searchNeurons, 300);

    const closeDialog = () => {
      selectedSource.value = null;
      selectedTarget.value = null;
      emit("update:showConnectDialog", false);
    };

    const connectNeurons = () => {
      connectNeuronLink({
        sourceId: selectedSource.value,
        targetId: selectedTarget.value,
      }).then((res) => {
        if (res.code === 200) {
          ElMessage.success("连接成功");
          emit("update:showConnectDialog", false);
          emit("modifySuccess");
        } else {
          ElMessage.error("连接失败");
        }
      });
    };

    const disconnectNeurons = () => {
      disconnectNeuronLink({
        sourceId: selectedSource.value,
        targetId: selectedTarget.value,
      }).then((res) => {
        if (res.code === 200) {
          ElMessage.success("断开成功");
          emit("update:showConnectDialog", false);
          emit("modifySuccess");
        } else {
          ElMessage.error("断开失败");
        }
      });
    };

    return {
      selectedSource,
      selectedTarget,
      searchResults,
      loading,
      debouncedSearch,
      closeDialog,
      connectNeurons,
      disconnectNeurons,
    };
  },
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
</style>
