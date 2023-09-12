<template>
  <div :style="positionStyle" class="node-info">
    <div class="card" @click="toggleFlip">
      <div class="front" :style="frontStyle">
        <img
          :src="node.coverImg"
          alt="front"
        />
      </div>
      <div class="back" :style="backStyle">
        <div class="back-content">
          <button @click.stop="addNode">点我增加</button>
          <button @click.stop="deleteNode">点我删除</button>
          <button @click.stop="focusOnNode">点我聚焦</button>
          <button @click.stop="enterNode">点我进入</button>
          <div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "YourComponent",
  props: ["node", "position"],
  setup(props, { emit }) {
    // 创建变量
    const flipped = ref(false);
    const imgHeight = ref(0);
    const store = useStore();
    const router = useRouter();

    onMounted(() => {
      const img = document.querySelector(".front img");
      img.onload = () => {
        const card = document.querySelector(".card");
        card.style.height = `${img.height}px`;
        imgHeight.value = img.height;
      };
    });
    // 翻转卡片
    const toggleFlip = () => {
      flipped.value = !flipped.value;
    };
    // 增加节点
    const addNode = () => {
      emit("addNode")
    };
    // 聚焦到当前选中的节点
    const focusOnNode = () => {
      emit("focusOnNode");
    };
    // 进入节点
    const enterNode = () => {
      store.commit(
        "setContentUrl",
        props.node.contentImg
      );
      router.push({ name: "Neuron" });
    };
    // 计算位置
    const positionStyle = computed(() => {
      return props.position
        ? {
            left: `${props.position.x - props.position.halfWidth}px`,
            top: `${props.position.y - imgHeight.value / 2}px`,
          }
        : {};
    });
    // 计算翻转
    const frontStyle = computed(() => {
      return flipped.value
        ? { transform: "perspective(600px) rotateY(-180deg)" }
        : {};
    });

    const backStyle = computed(() => {
      return flipped.value
        ? { transform: "perspective(600px) rotateY(0deg)" }
        : {};
    });

    return {
      flipped,
      imgHeight,
      toggleFlip,
      focusOnNode,
      enterNode,
      addNode,
      positionStyle,
      frontStyle,
      backStyle,
    };
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
  display: flex;
  justify-content: center;
  align-items: center;
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
