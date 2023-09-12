<template>
  <div id="app">
    <header>
      <!-- 这里可以是你的导航栏 -->
    </header>
    <main class="main">
      <router-view v-slot="{ Component }">
        <template v-if="$route.meta.keepAlive">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </template>
        <component :is="Component" v-else />
      </router-view>
      <!-- 这个router-view标签会根据当前的路由显示相应的组件 -->
    </main>
    <footer>
      <!-- 这里可以是你的页脚 -->
    </footer>
  </div>
</template>

<script>
// 导入组件

export default {
  name: "App",
};
</script>

<style>
/* 在这里添加全局样式 */
#app, .main {
  width: 100%;
  height: 100%;
}
</style>
