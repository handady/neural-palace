<template>
  <div class="neuron">
    <img :src="contentUrl" alt="contentUrl" class="imageContent">
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  name: "Neuron",
  setup() {
    const store = useStore();
    const contentUrl = store.state.contentUrl;
    onMounted(() => {
      console.log("contentUrl: ", contentUrl);
    });
    return {
      contentUrl,
    };
  },
};
</script>

<style scoped>
.neuron {
  width: 100%;
  height: 100%;
}
.imageContent{
  width: 100%;
  height: 100%;
}
</style>
