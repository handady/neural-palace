<template>
  <div class="hotspot" :style="getFixedPosition(position)">
    <!-- 使用swiper -->
    <div class="swiper" ref="swiperRef">
      <div class="swiper-wrapper">
        <!-- Slides -->
        <div class="swiper-slide">
          <mavon-editor
            ref="transformedKnowledgeRef"
            v-model="transformedKnowledgeValue"
            :toolbars="customToolbars"
            :subfield="false"
            :scrollStyle="true"
            @imgAdd="imgAddTransformedKnowledge"
            @save="saveTransformedKnowledge"
            defaultOpen="preview"
            class="mavon-editor"
          />
        </div>
        <div class="swiper-slide">
          <mavon-editor
            ref="originalKnowledgeRef"
            v-model="originalKnowledgeValue"
            :toolbars="customToolbars"
            :subfield="false"
            :scrollStyle="true"
            @imgAdd="imgAddOriginalKnowledge"
            @save="saveOriginalKnowledge"
            defaultOpen="preview"
            class="mavon-editor"
          />
        </div>
      </div>
      <!-- If we need pagination -->
      <div class="swiper-pagination"></div>

      <!-- If we need navigation buttons -->
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
    <!-- 隐藏按钮，一个叉号 -->
    <div class="close-btn" @click.stop="hideSpot">
      <span>x</span>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { uploadObject } from "@/api/utils";

export default {
  name: "HotSpot",
  props: ["position"],
  setup(props, { emit }) {
    const swiperRef = ref(null);
    const transformedKnowledgeValue = ref("");
    const originalKnowledgeValue = ref("");
    const transformedKnowledgeRef = ref(null);
    const originalKnowledgeRef = ref(null);
    const customToolbars = {
      preview: true,
      readmodel: true,
      undo: true, // 上一步
      redo: true, // 下一步
      trash: true, // 清空
      imagelink: true, // 图片链接
      save: true, // 保存（触发events中的save事件）
    };

    // 图片上传值自己的服务器
    const imgAddOriginalKnowledge = (pos, $file) => {
      uploadObject($file).then((res) => {
        const url = "https://" + res.data.fileLocation;
        originalKnowledgeRef.value.$img2Url(pos, url);
      });
    };
    const saveOriginalKnowledge = () => {
      emit("saveOriginalKnowledge", {
        originalKnowledgeValue: originalKnowledgeValue.value,
        position_index: props.position.position_index,
      });
    };
    const imgAddTransformedKnowledge = (pos, $file) => {
      uploadObject($file).then((res) => {
        const url = "https://" + res.data.fileLocation;
        transformedKnowledgeRef.value.$img2Url(pos, url);
      });
    };
    const saveTransformedKnowledge = () => {
      emit("saveTransformedKnowledge", {
        transformedKnowledgeValue: transformedKnowledgeValue.value,
        position_index: props.position.position_index,
      });
    };

    onMounted(() => {
      Swiper.use([Navigation, Pagination]);

      new Swiper(swiperRef.value, {
        direction: "horizontal",
        effect: "cards",
        preventInteractionOnTransition: true,
        slidesPerView: 1,
        grabCursor: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          dynamicBullets: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });

      // 给markdown富文本赋值
      originalKnowledgeValue.value = props.position.original_knowledge
        ? props.position.original_knowledge
        : "";
      transformedKnowledgeValue.value = props.position.transformed_knowledge
        ? props.position.transformed_knowledge
        : "";
    });

    function getFixedPosition(position) {
      return {
        position: "fixed",
        left: `${position.relativeX}%`,
        top: `${position.relativeY}%`,
      };
    }

    // 隐藏热点
    function hideSpot() {
      emit("hideSpot");
    }

    return {
      getFixedPosition,
      swiperRef,
      hideSpot,
      transformedKnowledgeValue,
      originalKnowledgeValue,
      customToolbars,
      imgAddOriginalKnowledge,
      transformedKnowledgeRef,
      originalKnowledgeRef,
      imgAddTransformedKnowledge,
      saveTransformedKnowledge,
      saveOriginalKnowledge,
    };
  },
};
</script>

<style scoped>
.hotspot {
  position: relative;
  width: 300px;
  transform: translate(-50%, -50%);
}
.swiper {
  width: 100%;
  height: 100%;
}
.swiper-slide {
  width: 100%;
  height: 100%;
  border-radius: 5%;
  box-shadow: 0px 15px 30px 0px rgba(254, 158, 181, 0.6),
    inset 0px -5px 16px 0px rgba(254, 158, 181, 0.7),
    inset 0px 11px 28px 0px rgb(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  background-color: #fff;
}

.close-btn {
  position: absolute;
  z-index: 1;
  top: 10px;
  right: 70px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ff93df;
  border-radius: 20%;
  color: #fff;
  cursor: pointer;
}

.close-btn span {
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-1px);
}

:deep(.swiper-pagination-bullet-active) {
  background-color: #ff93df;
}

:deep(.swiper-button-prev:after),
:deep(.swiper-button-next:after) {
  color: #ff93df;
  font-size: 20px;
}

.mavon-editor {
  height: 200px;
}
</style>
