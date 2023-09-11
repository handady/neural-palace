<template>
  <div class="neuron">
    <h1>Neuron</h1>
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

<style></style>
