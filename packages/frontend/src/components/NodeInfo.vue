<template>
  <div :style="positionStyle" class="node-info">
    <div class="mask" v-if="isModifyNode"></div>
    <div class="card">
      <div class="front" :style="frontStyle" @click="toggleFlip">
        <img :src="coverImgUrl" alt="front" />
      </div>
      <div class="back" :style="backStyle" @click="toggleFlip">
        <div class="back-content" v-if="!isModifyNode">
          <div class="row">
            <span class="rowId">{{ node.id }}</span>
            <span class="rowId" style="margin: 0 4px">-</span>
            <span class="rowId">{{ node.group }}</span>
          </div>
          <div class="row">
            <WaterButton
              :value="'增加'"
              @click.stop="modifyNode('add')"
              colorType="pink"
              style="margin-right: 10%; margin-bottom: 15%"
            />
            <WaterButton
              :value="'修改'"
              @click.stop="modifyNode('edit')"
              colorType="blue"
            />
          </div>
          <div class="row">
            <WaterButton
              :value="'聚焦'"
              @click.stop="focusOnNode"
              colorType="green"
              style="margin-right: 10%; margin-bottom: 15%"
            />
            <WaterButton
              :value="'删除'"
              @click.stop="deleteNode"
              colorType="red"
            />
          </div>
          <div class="row square-btn">
            <SquareButton :value="'进入'" @click.stop="enterNode" />
          </div>
        </div>
        <NodeDialog
          v-else
          @click.stop
          @goBack="goBack"
          @modifySuccess="modifySuccess"
          :nodeInfo="node"
          :modifyType="modifyType"
          :coverImgUrl="coverImgUrl"
          :contentImgUrl="contentImgUrl"
        ></NodeDialog>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import NodeDialog from "@/components/NodeDialog.vue";
import WaterButton from "./WaterButton.vue";
import SquareButton from "./SquareButton.vue";
import { deleteNeuronNode } from "@/api/neuronNode";
import { deleteNeuronLink } from "@/api/neuronLink";

export default {
  name: "NodeInfo",
  props: ["node", "position", "coverImgUrl", "contentImgUrl"],
  components: {
    NodeDialog,
    WaterButton,
    SquareButton,
  },
  setup(props, { emit }) {
    // 创建变量
    const flipped = ref(false);
    const imgHeight = ref(0);
    const store = useStore();
    const router = useRouter();
    const isModifyNode = ref(false);
    const modifyType = ref("");
    const card = ref(null);

    onMounted(() => {
      const img = document.querySelector(".front img");
      // 设置图片高度
      img.onload = () => {
        const card = document.querySelector(".card");
        card.style.height = `${img.height}px`;
        imgHeight.value = img.height;
      };
      // 获取card元素
      card.value = document.querySelector(".node-info");
    });
    // 翻转卡片
    const toggleFlip = () => {
      flipped.value = !flipped.value;
    };
    // 节点操作
    const modifyNode = (type) => {
      modifyType.value = type;
      isModifyNode.value = true;
      // 修改card的宽和高
      if (card.value) {
        card.value.style.minHeight = "350px";
        card.value.style.minWidth = "250px";
      }
    };
    // 删除节点
    const deleteNode = async () => {
      try {
        const [linkRes, nodeRes] = await Promise.all([
          deleteNeuronLink(props.node.id),
          deleteNeuronNode(props.node.id),
        ]);

        if (linkRes.code === 200 && nodeRes.code === 200) {
          modifySuccess();
          ElMessage({ message: "删除成功", type: "success" });
        } else {
          // 处理错误情况
          ElMessage({ message: "删除失败", type: "error" });
        }
      } catch (error) {
        // 网络错误或其他异常情况
        ElMessage({ message: "删除失败", type: "error" });
      }
    };
    // 子节点函数
    const goBack = () => {
      isModifyNode.value = false;
      // 修改card的宽和高
      if (card.value) {
        card.value.style.minHeight = "";
        card.value.style.minWidth = "";
      }
    };
    const modifySuccess = () => {
      goBack();
      // 让父组件重新获取数据
      emit("modifySuccess");
    };
    // 聚焦到当前选中的节点
    const focusOnNode = () => {
      emit("focusOnNode");
    };
    // 进入节点
    const enterNode = () => {
      store.commit("setContentUrl", props.contentImgUrl);
      store.commit("setId", props.node.id);
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
      modifyNode,
      positionStyle,
      frontStyle,
      backStyle,
      isModifyNode,
      goBack,
      modifyType,
      modifySuccess,
      deleteNode,
    };
  },
};
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  z-index: 0;
  transition: background 0.6s linear;
}
.node-info {
  position: fixed;
  z-index: 100;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  width: 15%;
  max-width: 512px;
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

.row {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 5%;

  .rowId {
    font-weight: 600;
    margin-bottom: 10%;
  }
}

.back-content {
  color: #2c3e50;
  text-align: center;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 5%;
}

.square-btn {
  padding: 0 6%;
}
</style>
