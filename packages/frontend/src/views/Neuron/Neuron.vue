<template>
  <div class="neuron-box" @click="recordPosition">
    <div class="neuron" :style="backgroundStyle"></div>
    <template v-for="position in positions" class="fixed-marker-box">
      <div
        v-if="position.index <= currentVisibleIndex"
        :key="position.index"
        :style="getFixedPosition(position)"
        class="fixed-marker animate__animated animate__fadeInUpBig"
      ></div>
    </template>
    <div class="recordBtn">
      <el-button type="primary" @click.stop="submit"> 提交 </el-button>
      <el-button type="primary" @click.stop="recordFlag = !recordFlag">
        {{ recordFlag ? "停止记录" : "开始记录" }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { getNextIndex } from "@/utils/utils";
import "animate.css";

export default {
  name: "Neuron",
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

    // 监听鼠标滚轮事件
    function handleWheel(event) {
      if (event.deltaY > 0) {
        if (currentVisibleIndex.value < positions.value.length - 1) {
          currentVisibleIndex.value++;
        }
      } else {
        // if (currentVisibleIndex.value >= 0) {
        //   currentVisibleIndex.value--;
        // }
      }
    }
    // 记录位置
    function recordPosition(event) {
      if (!recordFlag.value) return;
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
        index: nextIndex,
        relativeX,
        relativeY,
      });
      console.log(positions.value);
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
      console.log(positions.value);
    }

    onMounted(() => {
      window.addEventListener("wheel", handleWheel);
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
      submit,
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
.fixed-marker {
  position: fixed;
  width: 50px;
  height: 50px;
  background-color: red;
  transform: translate(-50%, -50%);
}
.recordBtn {
  position: fixed;
  top: 10px;
  right: 10px;
}
</style>
