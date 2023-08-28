<template>
  <div class="pannel" :style="positionStyle">
    <button @click="toNeuron">点我进入</button>
  </div>
</template>

<script>
export default {
  props: ["node", "position"],
  computed: {
    positionStyle() {
      return this.position
        ? {
            left: this.position.x+200 + "px",
            top: this.position.y + "px",
            // 其他样式
          }
        : {};
    },
    mounted() {
      console.log(this.node);
    },
  },
};
</script>

<style scoped>
.pannel {
  width: 100px;
  height: 100px;
  background: blue;
  position: fixed;
  z-index: 100;
  box-sizing: border-box;
}
</style>
