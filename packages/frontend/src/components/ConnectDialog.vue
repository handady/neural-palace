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
          style="width: 80%"
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
          style="width: 80%"
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
      <el-button type="warning" @click="swapValues">交换</el-button>
      <el-button type="danger" @click="disconnectNeurons">断开</el-button>
      <el-button type="primary" @click="connectNeurons">连接</el-button>
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
      // 如果某一个神经元为空，则提示用户
      if (!selectedSource.value || !selectedTarget.value) {
        ElMessage.error("请选择要连接的两个神经元");
        return;
      } else if (selectedSource.value === selectedTarget.value) {
        ElMessage.error("源神经元与目标神经元不能相同");
        return;
      }
      connectNeuronLink({
        sourceId: selectedSource.value,
        targetId: selectedTarget.value,
      }).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
          emit("update:showConnectDialog", false);
          emit("modifySuccess");
        } else {
          ElMessage.error("连接失败");
        }
      });
    };

    const disconnectNeurons = () => {
      if (!selectedSource.value || !selectedTarget.value) {
        ElMessage.error("请选择要断开的两个神经元");
        return;
      } else if (selectedSource.value === selectedTarget.value) {
        ElMessage.error("源神经元与目标神经元不能相同");
        return;
      }
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

    // 交换值
    const swapValues = () => {
      const temp = selectedSource.value;
      selectedSource.value = selectedTarget.value;
      selectedTarget.value = temp;
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
      swapValues,
    };
  },
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
</style>
