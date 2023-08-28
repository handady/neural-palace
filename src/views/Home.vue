<template>
  <div>
    <div id="loading-screen">
      <div class="loader">在加载了( ๑ŏ ﹏ ŏ๑ )别催我</div>
      <div id="progress-bar">
        <div id="progress"></div>
      </div>
    </div>
    <NodeInfo
      v-if="currentNode"
      :node="currentNode"
      :position="currentPosition"
      ref="nodeInfoRef"
    />
    <NodePannel
      v-if="currentNode"
      :node="currentNode"
      :position="currentPosition"
    />
    <div id="3d-graph"></div>
  </div>
</template>

<script>
import { onMounted, ref, onUnmounted } from "vue";
import ForceGraph3D from "3d-force-graph";
import * as d3 from "d3";
import * as THREE from "three";
import { createStars, createUniverse } from "@/utils/functions"; // 导入相关函数
import NodeInfo from "@/components/NodeInfo.vue";
import NodePannel from "@/components/NodePannel.vue";
import "animate.css";
import universeImg from "@/assets/银河全景.jpg";
import materialMap from "@/configs/materialConfigs"; // 单独配置的材质配置文件
import starConfigs from "@/configs/starConfigs"; // 单独配置的星星配置文件
import {
  createLoadingManager,
  updateSize,
  preloadMaterials,
  getNodeColor,
  createLinkObject,
  getNodeThreeObject,
  addPostProcessingEffects,
} from "@/utils/init"; // 导入相关函数

export default {
  components: { NodeInfo, NodePannel },
  setup() {
    // 创建变量
    const Graph = ref(null);
    const currentNode = ref(null); // 用于保存当前悬停的节点
    const currentPosition = ref(null); // 用于保存当前悬停节点的位置
    const nodeColorScale = d3.scaleOrdinal(d3.schemeRdYlGn[4]); // 节点颜色
    const manager = createLoadingManager(); // 创建LoadingManager对象
    const resizeHandler = () => updateSize(Graph); // 监听浏览器窗口变化
    const nodeInfoRef = ref(null); // 用于保存节点信息组件的引用

    onMounted(() => {
      // 预加载纹理
      const textureLoader = new THREE.TextureLoader(manager);
      const loadedMaterials = preloadMaterials(textureLoader, materialMap);
      // 创建3D图形
      Graph.value = ForceGraph3D({ controlType: "trackball" })(
        document.getElementById("3d-graph")
      )
        .jsonUrl("./miserables.json")
        .showNavInfo(false)
        .nodeResolution(16)
        .nodeColor((node) => getNodeColor(node, nodeColorScale))
        .linkThreeObject((link) => createLinkObject(link, nodeColorScale))
        .backgroundColor("rgba(0,0,0,0)")
        .onNodeClick((node) => {
          const distance = 40;
          const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

          const newPos =
            node.x || node.y || node.z
              ? {
                  x: node.x * distRatio,
                  y: node.y * distRatio,
                  z: node.z * distRatio,
                }
              : { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)

          Graph.value.cameraPosition(
            newPos, // new position
            node, // lookAt ({ x, y, z })
            3000 // ms transition duration
          );
        })
        .nodeOpacity(0.85)
        .onNodeHover((node) => {
          if (node) {
            const position = Graph.value.graph2ScreenCoords(
              node.x,
              node.y,
              node.z
            );
            currentPosition.value = {
              x: position.x - 100,
              y: position.y - 100,
            };
            currentNode.value = {
              image: node.img, // 节点图片
              description: node.id, // 节点信息
            };
          } else {
            currentNode.value = null;
            currentPosition.value = null;
          }
        })
        .nodeThreeObject((node) => getNodeThreeObject(node, loadedMaterials));

      Graph.value.controls().maxDistance = 5000;

      // 监听窗口变化, 重新渲染
      window.addEventListener("resize", resizeHandler);
      // 后处理效果
      addPostProcessingEffects(Graph);
      // 创建宇宙背景和星星
      const { universeMesh, starMesh } = createSceneObjects(
        Graph,
        universeImg,
        textureLoader,
        starConfigs
      );
      // 动画效果
      animateScene(Graph, universeMesh, starMesh);
    });

    // 销毁
    onUnmounted(() => {
      window.removeEventListener("resize", resizeHandler);
    });

    return {
      Graph,
      currentNode,
      currentPosition,
      nodeInfoRef,
    };
  },
};
// 创建宇宙背景和星星
function createSceneObjects(Graph, universeImg, textureLoader, starConfigs) {
  // 创建宇宙背景
  const universeMesh = createUniverse(universeImg, textureLoader);
  Graph.value.scene().add(universeMesh);

  // 创建星星
  const starMesh = starConfigs.map((config) =>
    createStars(config, textureLoader)
  );
  starMesh.forEach((mesh) => Graph.value.scene().add(mesh));

  return { universeMesh, starMesh };
}
// 动画效果
function animateScene(Graph, universeMesh, starMesh) {
  // 动画效果
  const animate = () => {
    requestAnimationFrame(animate);

    // 旋转
    starMesh.forEach((mesh) => {
      mesh.rotation.y += 0.0001;
    });
    universeMesh.rotation.y += 0.00001;

    Graph.value.postProcessingComposer().render();
  };

  animate();
}
</script>

<style scoped>
#3d-graph {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
#loading-screen {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 1);
  z-index: 1000;
  top: 0;
  left: 0;
}

.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  color: #000;
}

#progress-bar {
  width: 80%;
  height: 10px;
  background-color: #ccc;
  position: absolute;
  top: 55%;
  left: 10%;
}

#progress {
  height: 100%;
  background-color: #4caf50;
  width: 0;
}
.bounce-enter-active {
  animation: animate__bounceIn 1s; /* 使用 animate.css 的 bounceIn 动画 */
}
.bounce-leave-active {
  animation: animate__bounceOut 1s; /* 使用 animate.css 的 bounceOut 动画 */
}
</style>
