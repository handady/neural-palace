<template>
  <div :style="positionStyle" class="node-info">
    <div class="card" @click="toggleFlip">
      <div class="front" :style="frontStyle">
        <img
          src="https://avatars0.githubusercontent.com/u/10555820?s=460&v=4"
          alt="front"
        />
      </div>
      <div class="back" :style="backStyle">
        <div class="back-content">
          <h2>Hans Distance</h2>
          <span>1622352990@qq.com</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      flipped: false,
      imgHeight: 0,
    };
  },
  props: ["node", "position"],
  computed: {
    positionStyle() {
      return this.position
        ? {
            left: `${this.position.x - this.position.halfWidth}px`,
            top: `${this.position.y - this.imgHeight / 2}px`,
          }
        : {};
    },
    frontStyle() {
      return this.flipped
        ? { transform: "perspective(600px) rotateY(-180deg)" }
        : {};
    },
    backStyle() {
      return this.flipped
        ? { transform: "perspective(600px) rotateY(0deg)" }
        : {};
    },
  },
  methods: {
    toggleFlip() {
      this.flipped = !this.flipped;
    },
  },
  mounted() {
    this.$nextTick(() => {
      const img = this.$el.querySelector(".front img");
      img.onload = () => {
        const card = this.$el.querySelector(".card");
        card.style.height = `${img.height}px`;
        this.imgHeight = img.height;
      };
    });
  },
};
</script>

<style scoped>
.node-info {
  position: fixed;
  z-index: 100;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  width: 15%;
}

.card {
  cursor: pointer;
  width: 100%;
  height: auto;
}

.front,
.back {
  width: 100%;
  height: 100%;
  overflow: hidden;
  backface-visibility: hidden;
  position: absolute;
  transition: transform 0.6s linear;
  border-radius: 5%;
  box-shadow: 0px 15px 30px 0px rgba(254, 158, 181, 0.6),
    inset 0px -5px 16px 0px rgba(254, 158, 181, 0.7),
    inset 0px 11px 28px 0px rgb(255, 255, 255, 0.8);
}

.front img {
  width: 100%;
  height: auto;
}
.front {
  background: #f1f1f1;
  transform: perspective(600px) rotateY(0deg);
}
.back {
  background: #f1f1f1;
  transform: perspective(600px) rotateY(180deg);
}
.back-content {
  color: #2c3e50;
  text-align: center;
  width: 100%;
}
</style>
