<template>
  <div :style="positionStyle" class="node-info">
    <img src="https://obsidian-pictures-1306223723.cos.ap-nanjing.myqcloud.com/2023/202305241250504.png" alt="Node Image" class="node-image" />
  </div>
</template>

<script>

export default {
  props: ["node", "position"],
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
    console.log(this.node);
  },
};
</script>

<style scoped>


.node-info {
  position: fixed;
  z-index: 100;
  box-sizing: border-box;
  backdrop-filter: blur(3px);
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  box-shadow: 0px 15px 30px 0px rgba(254, 158, 181, 0.6),
    inset 0px -5px 16px 0px rgba(254, 158, 181, 0.7),
    inset 0px 11px 28px 0px rgb(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  width:10%;
}

.node-image {
  width: 100%;
}
</style>
