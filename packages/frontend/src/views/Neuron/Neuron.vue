<template>
  <div class="neuron" :style="backgroundStyle"></div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "Neuron",
  setup() {
    const store = useStore();
    const contentUrl = store.state.contentUrl;
    const backgroundStyle = computed(() => {
      return {
        background: `url(${contentUrl}) no-repeat center center`,
        backgroundSize: "cover",
      };
    });
    onMounted(() => {});
    return {
      contentUrl,
      backgroundStyle,
    };
  },
};
</script>

<style scoped>
.neuron {
  width: 100%;
  height: 100%;
}
</style>
