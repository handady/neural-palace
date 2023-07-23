<template>
    <div class="home">
        <h1>Home</h1>
    </div>
</template>

<script>
import { ref } from 'vue';
export default {
    name: 'Home',
    setup() {
        // 使用 ref 创建响应式的数据
        const data = ref({
            // 你可以在这里定义组件的数据
        });

        return {
            data,
            // 你的组件的方法可以在这里定义
        };
    }
}
</script>

<style></style>