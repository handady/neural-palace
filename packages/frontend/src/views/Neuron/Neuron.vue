<template>
  <div class="neuron-box" @click="recordPosition">
    <div class="neuron">
      <!-- 使用swiper -->
      <div class="swiper" ref="swiperRef">
        <div class="swiper-wrapper">
          <!-- Slides -->
          <div
            class="swiper-slide"
            v-for="(item, index) in contentImgList"
            :key="index"
          >
            <el-image :src="item" fit="cover"></el-image>
          </div>
        </div>
        <div class="swiper-scrollbar"></div>
      </div>
    </div>
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
            class="fixed-marker draggable"
            :data-index="position.position_index"
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
          class="fixed-marker draggable"
          :data-index="position.position_index"
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
      <div class="row">
        <WaterButton
          colorType="pink"
          :value="'新增图片'"
          style="margin-right: 12%; margin-bottom: 12%"
          @click.stop="openDialog('add')"
        />
        <WaterButton
          v-if="currentVisibleIndex < positions.length - 1"
          colorType="green"
          @click.stop="currentVisibleIndex = positions.length - 1"
          :value="'显示全部'"
          style="margin-right: 12%; margin-bottom: 12%"
        />
        <WaterButton
          v-if="currentVisibleIndex === positions.length - 1"
          colorType="green"
          @click.stop="currentVisibleIndex = -1"
          :value="'隐藏全部'"
          style="margin-right: 12%; margin-bottom: 12%"
        />
        <WaterButton
          colorType="pink"
          @click.stop="goBack"
          :value="'返回首页'"
          style="margin-bottom: 12%"
        />
      </div>
      <div class="row">
        <WaterButton
          colorType="pink"
          :value="'删除图片'"
          style="margin-right: 12%; margin-bottom: 12%"
          @click.stop="openDialog('delete')"
        />
        <WaterButton
          colorType="pink"
          @click.stop="recordFlag = !recordFlag"
          :value="recordFlag ? '停止记录' : '开始记录'"
          style="margin-right: 12%; margin-bottom: 12%"
        />
        <WaterButton
          colorType="blue"
          @click.stop="submit"
          :value="'保存状态'"
          style="margin-bottom: 12%"
        />
      </div>
    </div>
    <EditDialog
      v-model:dialogType="dialogType"
      :contentId="contentId"
      :contentImgId="contentImgList[activeContentIndex - 1]"
      :contentIndex="contentImgList.length"
      :activeContentIndex="activeContentIndex"
      @modifySuccess="init"
    />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, reactive } from "vue";
import router from "@/router";
import { useStore } from "vuex";
import { getNextIndex } from "@/utils/utils";
import {
  submitNeuronNodeContent,
  getNeuronNodeContent,
} from "@/api/neuronNode";
import {
  updateTransformedKnowledge,
  updateOriginalKnowledge,
  getContentImageList,
} from "@/api/neuronPositions";
import { ElMessage } from "element-plus";
import HotSpot from "./HotSpot.vue";
import WaterButton from "@/components/WaterButton.vue";
import EditDialog from "./EditDialog.vue";
import "animate.css";
import _ from "lodash";
import interact from "interactjs";
import Swiper from "swiper";
import { Scrollbar } from "swiper/modules";
import "swiper/swiper-bundle.css";

export default {
  name: "Neuron",
  components: { HotSpot, WaterButton, EditDialog },
  setup() {
    const store = useStore();
    const contentUrl = store.state.contentUrl;
    const contentId = store.state.id;
    const contentImgList = ref([]);
    const recordFlag = ref(false);
    const interactFlag = ref(false); // 自由拖动的时候阀门
    const positions = ref([]); // 用于保存物品的百分比坐标
    const currentVisibleIndex = ref(-1); // 当前可见的物品
    const addVisibleIndex = ref(-1);
    const swiperRef = ref(null);
    const dialogType = ref(null);
    const activeContentIndex = ref(1);

    // 监听鼠标滚轮事件
    function handleWheel(event) {
      if (event.deltaY > 0) {
        if (currentVisibleIndex.value < positions.value.length - 1) {
          currentVisibleIndex.value++;
        }
      }
    }

    // 记录位置
    function recordPosition(event) {
      if (!recordFlag.value || positions.value.length >= 10) {
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();
      const { left, top, width, height } = rect;
      const { clientX, clientY } = event;

      const relativeX = ((clientX - left) / width) * 100;
      const relativeY = ((clientY - top) / height) * 100;

      const nextIndex = getNextIndex(positions.value);

      positions.value.push({
        id: contentImgList.value[activeContentIndex.value - 1],
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
      if (!interactFlag.value) {
        // 如果该 index 不存在于 showHotSpot，或者为 false，则设置为 true
        if (!showHotSpot[index]) {
          showHotSpot[index] = true;
        } else {
          // 如果已经是 true，则设置为 false
          showHotSpot[index] = false;
        }
      }
    };

    // 更新markdown富文本
    const saveKnowledge = (updateFunc, field, value) => {
      const payload = {
        id: contentImgList.value[activeContentIndex.value - 1],
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

    // 返回上一页
    function goBack() {
      router.back();
    }

    // 初始化数据
    const init = () => {
      // 获取图片内容列表
      getContentImageList({
        id: contentId,
      }).then((res) => {
        contentImgList.value = res.data;

        // 获取数据
        getNeuronNodeContent(
          contentImgList.value[activeContentIndex.value - 1]
        ).then((res) => {
          if (res.code === 200) {
            positions.value = res.data;
            addVisibleIndex.value = positions.value.length - 1;
          }
        });
      });
    };

    // 打开对话框
    const openDialog = (type) => {
      dialogType.value = type;
    };

    onMounted(() => {
      init();
      Swiper.use([Scrollbar]);

      new Swiper(swiperRef.value, {
        direction: "horizontal",
        effect: "fade",
        observer: true,
        scrollbar: {
          el: ".swiper-scrollbar",
          draggable: true,
        },
        on: {
          slideChange: (swiper) => {
            activeContentIndex.value = swiper.activeIndex + 1;
            currentVisibleIndex.value = -1;
            addVisibleIndex.value = -1;
            // 获取数据
            getNeuronNodeContent(
              contentImgList.value[activeContentIndex.value - 1]
            ).then((res) => {
              if (res.code === 200) {
                positions.value = res.data;
                addVisibleIndex.value = positions.value.length - 1;
              }
            });
          },
        },
      });
      const debounceHandleWheel = _.debounce(handleWheel, 100);
      window.addEventListener("wheel", debounceHandleWheel);
      // 初始化interact.js
      interact(".draggable").draggable({
        // 拖动的配置选项
        listeners: {
          start(event) {
            interactFlag.value = true;
          },
          move(event) {
            const target = event.target;
            const index = target.getAttribute("data-index");
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const relativeX = (event.clientX / viewportWidth) * 100;
            const relativeY = (event.clientY / viewportHeight) * 100;

            const pos = positions.value.find(
              (p) => p.position_index === +index
            );
            if (pos) {
              pos.relativeX = relativeX;
              pos.relativeY = relativeY;
            }
          },
          end(event) {
            setTimeout(() => {
              interactFlag.value = false;
            }, 500);
          },
        },
      });
    });

    onUnmounted(() => {
      window.removeEventListener("wheel", handleWheel);
    });

    return {
      contentUrl,
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
      goBack,
      contentImgList,
      swiperRef,
      dialogType,
      openDialog,
      contentId,
      init,
      activeContentIndex,
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

.draggable {
  cursor: pointer !important;
}

.row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.swiper,
.swiper-image,
.swiper-slide {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 0;
}

:deep(.swiper-scrollbar-drag) {
  background-color: #ff93df;
}
</style>
