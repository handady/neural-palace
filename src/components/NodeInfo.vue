<template>
  <div :style="positionStyle" class="node-info">
    <img :src="node?.image" alt="Node Image" class="node-image" />
    <p>{{ node?.description }}</p>
    <!-- 更多信息 -->
  </div>
</template>

<script>

export default {
  props: ["node", "position", "transformScale"],
  computed: {
    positionStyle() {
      return this.position
        ? {
            left: this.position.x + "px",
            top: this.position.y + "px",
          }
        : {};
    },
  },
  mounted() {

  },
};
</script>

<style scoped>
@keyframes border-animation {
  0% {
    border: 2px solid rgba(220, 76, 173, 0.7);
  }
  25% {
    border: 2px solid rgba(183, 103, 191, 0.7);
  }
  50% {
    border: 2px solid rgba(90, 70, 220, 0.8);
  }
  75% {
    border: 2px solid rgba(222, 130, 121, 0.8);
  }
  100% {
    border: 2px solid rgba(220, 76, 173, 0.7);
  }
}

.node-info {
  position: fixed;
  z-index: 100;
  width: 200px;
  height: 200px;
  box-sizing: border-box;
  backdrop-filter: blur(3px);
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  box-shadow: 0px 15px 30px 0px rgba(254, 158, 181, 0.6),
    inset 0px -5px 16px 0px rgba(254, 158, 181, 0.7),
    inset 0px 11px 28px 0px rgb(255, 255, 255, 0.8);
  animation: border-animation 5s infinite; /* 5秒周期的无限循环动画 */
  display: flex;
  justify-content: center;
}

.node-image {
  width: 100%;
  height: 100px;
}
</style>
