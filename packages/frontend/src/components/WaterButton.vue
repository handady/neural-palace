<template>
  <div ref="wrapRef" class="btn-water-wrap">
    <div class="inner-div before" :style="innerDivStyle"></div>
    <div class="inner-div after" :style="innerDivStyle"></div>
    <input
      ref="waterBtnRef"
      type="button"
      :value="value"
      class="btn-water"
      :class="dynamicClass"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";

export default {
  name: "WaterButton",
  props: ["value", "colorType"],
  setup(props, { emit }) {
    const wrapRef = ref(null);
    const waterBtnRef = ref(null);
    const innerDivMap = {
      pink: {
        backgroundColor: "rgb(255, 223, 251)",
      },
      green: {
        backgroundColor: "rgb(190, 236, 225)",
      },
      blue: {
        backgroundColor: "rgb(193, 234, 236)",
      },
      red: {
        backgroundColor: "rgb(240, 161, 167)",
      },
    };

    const dynamicClass = computed(() => {
      return props.colorType || "pink";
    });

    const innerDivStyle = computed(() => {
      return innerDivMap[props.colorType] || {};
    });

    // Sets the height of an element based on its width.
    const setElementHeight = (elementRef) => {
      const elementWidth = elementRef.value.offsetWidth;
      elementRef.value.style.height = `${elementWidth}px`;
    };

    onMounted(() => {
      setElementHeight(wrapRef);
      setElementHeight(waterBtnRef);
    });

    return {
      wrapRef,
      waterBtnRef,
      innerDivStyle,
      dynamicClass,
    };
  },
};
</script>

<style lang="scss" scoped>
.btn-water {
  width: 100%;
  max-width: 200px;
  color: #333;
  font-weight: 600;
  font-size: 14px;
  line-height: 100%;
  border: none;
  border-radius: 50%;
  cursor: pointer;
}

@mixin buttonStyles($bgColor, $boxColor) {
  transition: all 0.5s;
  font-weight: 600;
  background-color: $bgColor;
  box-shadow: 10px 10px 30px 3px $boxColor,
    -1px -1px 10px 2px lighten($boxColor, 5%) inset,
    10px 10px 20px 3px darken($boxColor, 10%) inset,
    -6px -6px 10px 3px lighten($boxColor, 10%) inset;
  &:hover {
    background-color: darken($bgColor, 10%);
    box-shadow: 10px 10px 30px 3px darken($boxColor, 10%);
  }
}

.pink {
  @include buttonStyles(rgba(253, 188, 239, 0.897), rgb(247, 141, 224));
}
.green {
  @include buttonStyles(rgba(160, 238, 225, 0.897), rgb(115, 231, 212));
}
.blue {
  @include buttonStyles(rgba(145, 227, 231, 0.897), rgb(113, 230, 236));
}
.red {
  @include buttonStyles(rgba(236, 145, 145, 0.897), rgb(238, 106, 106));
}

.btn-water-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  transition: all 0.5s;
}

.btn-water-wrap:last-child {
  margin-bottom: 0;
}

.btn-water-wrap:hover {
  transform: scale(1.2);
}

.inner-div {
  position: absolute;
  border-radius: 50%;
  background-color: rgb(255, 255, 255);
  filter: blur(0.5px);
}

.inner-div.before {
  top: 21%;
  left: 18%;
  width: 12%;
  height: 12%;
}

.inner-div.after {
  top: 12.5%;
  left: 34%;
  width: 6%;
  height: 6%;
}
</style>
