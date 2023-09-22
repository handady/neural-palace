<template>
  <div class="neuron-box" @click="recordPosition">
    <div class="neuron" :style="backgroundStyle"></div>
    <template v-for="position in positions" class="fixed-marker-box">
      <transition
        v-if="position.position_index > addVisibleIndex"
        enter-active-class="animate__animated animate__fadeIn"
        :appear="true"
      >
        <div>
          <div
            v-if="!showHotSpot[position.position_index]"
            :style="getFixedPosition(position)"
            class="fixed-marker"
            @click.stop="toggleSpot(position.position_index)"
          ></div>

          <transition enter-active-class="animate__animated animate__fadeIn">
            <HotSpot
              v-if="showHotSpot[position.position_index]"
              :position="position"
              @hideSpot="toggleSpot(position.position_index)"
              @saveTransformedKnowledge="saveTransformedKnowledge"
              @saveOriginalKnowledge="saveOriginalKnowledge"
            />
          </transition>
        </div>
      </transition>
      <div
        v-else-if="position.position_index <= currentVisibleIndex"
        :key="position.position_index"
        :style="getFixedPosition(position)"
        class="animate__animated animate__fadeInUpBig"
      >
        <div
          v-if="!showHotSpot[position.position_index]"
          class="fixed-marker"
          @click.stop="toggleSpot(position.position_index)"
        ></div>

        <transition enter-active-class="animate__animated animate__fadeIn">
          <HotSpot
            v-if="showHotSpot[position.position_index]"
            :position="position"
            @hideSpot="toggleSpot(position.position_index)"
            @saveTransformedKnowledge="saveTransformedKnowledge"
            @saveOriginalKnowledge="saveOriginalKnowledge"
          />
        </transition>
      </div>
    </template>
    <div class="recordBtn">
      <el-button type="primary" @click.stop="currentVisibleIndex = 10">
        显示全部
      </el-button>
      <el-button type="primary" @click.stop="submit"> 提交 </el-button>
      <el-button type="primary" @click.stop="recordFlag = !recordFlag">
        {{ recordFlag ? "停止记录" : "开始记录" }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, reactive } from "vue";
import { useStore } from "vuex";
import { getNextIndex } from "@/utils/utils";
import {
  submitNeuronNodeContent,
  getNeuronNodeContent,
} from "@/api/neuronNode";
import {
  updateTransformedKnowledge,
  updateOriginalKnowledge,
} from "@/api/neuronPositions";
import { ElMessage } from "element-plus";
import HotSpot from "./HotSpot.vue";
import "animate.css";
import _ from "lodash";

export default {
  name: "Neuron",
  components: { HotSpot },
  setup() {
    const store = useStore();
    const contentUrl = store.state.contentUrl;
    const contentId = store.state.id;
    const recordFlag = ref(false);
    const positions = ref([]); // 用于保存物品的百分比坐标

    const backgroundStyle = computed(() => {
      return {
        background: `url(${contentUrl}) no-repeat center center`,
        backgroundSize: "cover",
      };
    });

    const currentVisibleIndex = ref(-1);
    const addVisibleIndex = ref(-1);

    // 监听鼠标滚轮事件
    function handleWheel(event) {
      console.log(event.deltaY);
      if (event.deltaY > 0) {
        if (currentVisibleIndex.value < positions.value.length - 1) {
          currentVisibleIndex.value++;
        }
      }
    }

    // 记录位置
    function recordPosition(event) {
      if (!recordFlag.value || positions.value.length >= 10) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;

      // 计算相对坐标（百分比）
      const relativeX = (x / width) * 100;
      const relativeY = (y / height) * 100;

      // 获取下一个可用的索引
      const nextIndex = getNextIndex(positions.value);

      // 保存相对坐标
      positions.value.push({
        id: contentId,
        position_index: nextIndex,
        relativeX,
        relativeY,
      });
    }
    // 获取位置
    function getFixedPosition({ relativeX, relativeY }) {
      return {
        position: "fixed",
        left: `${relativeX}%`,
        top: `${relativeY}%`,
      };
    }

    // 提交函数
    function submit() {
      // 数据总数不能超过10个
      if (positions.value.length > 10) {
        ElMessage.error("数据总数不能超过10个");
        return;
      } else {
        submitNeuronNodeContent(positions.value).then((res) => {
          if (res.code === 200) {
            ElMessage.success("提交成功");
          } else {
            ElMessage.error("提交失败");
          }
        });
      }
    }

    // showHotSpot相关
    const showHotSpot = reactive({});
    const toggleSpot = (index) => {
      // 如果该 index 不存在于 showHotSpot，或者为 false，则设置为 true
      if (!showHotSpot[index]) {
        showHotSpot[index] = true;
      } else {
        // 如果已经是 true，则设置为 false
        showHotSpot[index] = false;
      }
    };

    // 更新markdown富文本
    const saveKnowledge = (updateFunc, field, value) => {
      const payload = {
        id: contentId,
        position_index: value.position_index,
      };
      payload[field] = value[`${field}Value`];

      updateFunc(payload).then((res) => {
        const message = res.code === 200 ? "更新成功" : "更新失败";
        ElMessage[res.code === 200 ? "success" : "error"](message);
        if (res.code === 200) {
          init();
        }
      });
    };

    const saveTransformedKnowledge = (value) => {
      saveKnowledge(updateTransformedKnowledge, "transformedKnowledge", value);
    };

    const saveOriginalKnowledge = (value) => {
      saveKnowledge(updateOriginalKnowledge, "originalKnowledge", value);
    };

    // 初始化数据
    const init = () => {
      // 获取数据
      getNeuronNodeContent(contentId).then((res) => {
        if (res.code === 200) {
          positions.value = res.data;
          addVisibleIndex.value = positions.value.length - 1;
        }
      });
    };

    onMounted(() => {
      init();
      const debounceHandleWheel = _.debounce(handleWheel, 100);
      window.addEventListener("wheel", debounceHandleWheel);
    });

    onUnmounted(() => {
      window.removeEventListener("wheel", handleWheel);
    });

    return {
      contentUrl,
      backgroundStyle,
      recordPosition,
      positions,
      getFixedPosition,
      recordFlag,
      currentVisibleIndex,
      addVisibleIndex,
      submit,
      showHotSpot,
      toggleSpot,
      saveTransformedKnowledge,
      saveOriginalKnowledge,
    };
  },
};
</script>

<style scoped>
.neuron-box {
  width: 100%;
  height: 100%;
  position: relative;
}
.neuron {
  width: 100%;
  height: 100%;
}
.fixed-marker-box {
  width: 100%;
  height: 100%;
}
.recordBtn {
  position: fixed;
  top: 10px;
  right: 10px;
}

@-webkit-keyframes sonar {
  from {
    box-shadow: 0 0 0 0 #ff93df, 0 0 4px 2px rgba(0, 0, 0, 0.4);
  }
  to {
    box-shadow: 0 0 0 10px rgba(255, 147, 223, 0),
      0 0 4px 2px rgba(0, 0, 0, 0.4);
  }
}
@keyframes sonar {
  from {
    box-shadow: 0 0 0 0 #ff93df, 0 0 4px 2px rgba(0, 0, 0, 0.4);
  }
  to {
    box-shadow: 0 0 0 10px rgba(255, 147, 223, 0),
      0 0 4px 2px rgba(0, 0, 0, 0.4);
  }
}
.fixed-marker {
  position: fixed;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  box-sizing: border-box;
  background-color: #ff93df;
  border: 2px solid #ff60d0;
  transform: translate(-50%, -50%);
  -webkit-animation: sonar 1500ms ease-out infinite;
  animation: sonar 1500ms ease-out infinite;
  cursor: pointer;
}
</style>
