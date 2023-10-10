<template>
  <button class="button-64" role="button">
    <span class="text">{{ value }}</span>
  </button>
</template>

<script>
export default {
  name: "square-button",
  props: ["value"],
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.button-64 {
  align-items: center;
  width: 100%;
  background-image: linear-gradient(to bottom right, #fcd34d, #ef4444, #ec4899);
  border: 0;
  border-radius: 8px;
  box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
  box-sizing: border-box;
  color: #333;
  display: flex;
  font-size: 100%;
  justify-content: center;
  line-height: 1em;
  max-width: 100%;
  min-width: 50px;
  padding: 3px;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  cursor: pointer;
}

.button-64:active,
.button-64:hover {
  outline: 0;
}

.button-64 span {
  background: #f37107;
  padding: 8% 14%;
  border-radius: 6px;
  width: 100%;
  height: 100%;
  font-weight: 600;
  transition: 300ms;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.button-64:hover span {
  background: none;
  transform: scale(1.1);
}
</style>
