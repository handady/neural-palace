<template>
  <div class="hotspot" :style="getFixedPosition(position)">我是热点</div>
</template>

<script>
import { computed } from "vue";

export default {
  name: "HotSpot",
  props: ["position"],
  setup() {
    // 设置热点的位置
    function getFixedPosition(position) {
      return {
        position: "fixed",
        left: `${position.relativeX}%`,
        top: `${position.relativeY}%`,
      };
    }
    return {
      getFixedPosition,
    };
  },
};
</script>

<style scoped>
.hotspot {
  width: 100px;
  height: 100px;
  background-color: red;
  transform: translate(-50%, -50%);
}
</style>
