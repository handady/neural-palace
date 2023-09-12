<template>
  <div>
    <div id="loading-screen">
      <div class="loader">在加载了( ๑ŏ ﹏ ŏ๑ )别催我</div>
      <div id="progress-bar">
        <div id="progress"></div>
      </div>
    </div>
    <transition :name="transitionName">
      <NodeInfo
        v-if="currentNode"
        :node="currentNode"
        :position="currentPosition"
        @focusOnNode="focusOnNode"
        @addNode="addNode"
        ref="nodeInfoRef"
      />
    </transition>
    <transition :name="transitionName">
      <NodeDialog></NodeDialog>
    </transition>
    <div id="3d-graph"></div>
  </div>
</template>

<script>
import { onMounted, ref, onUnmounted, watch, nextTick, } from "vue";
import ForceGraph3D from "3d-force-graph";
import * as d3 from "d3";
import * as THREE from "three";
import { createStars, createUniverse } from "@/utils/functions"; // 导入相关函数
import { getNeuronNode } from "@/api/neuronNode"
import NodeInfo from "@/components/NodeInfo.vue";
import NodeDialog from "@/components/NodeDialog.vue"
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
  components: { NodeInfo, NodeDialog },
  setup() {
    // 创建变量
    const [Graph, currentNode, currentPosition, selectedNode, nodeInfoRef] = [
      ref(null),
      ref(null),
      ref(null),
      ref(null),
      ref(null),
    ];
    const initData = ref({
      nodes: [],
      links: [],
    });
    const nodeColorScale = d3.scaleOrdinal(d3.schemeRdYlGn[4]);
    const transitionName = ref("animate__animated");
    // Handlers and Utils
    const manager = createLoadingManager();
    const resizeHandler = () => updateSize(Graph);

    const focusOnNode = () => {
      // 聚焦到当前选中的节点
      const distance = 40;
      const distRatio =
        1 +
        distance /
          Math.hypot(
            selectedNode.value.x,
            selectedNode.value.y,
            selectedNode.value.z
          );

      const newPos =
        selectedNode.value.x || selectedNode.value.y || selectedNode.value.z
          ? {
              x: selectedNode.value.x * distRatio,
              y: selectedNode.value.y * distRatio,
              z: selectedNode.value.z * distRatio,
            }
          : { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)

      Graph.value.cameraPosition(
        newPos, // new position
        selectedNode.value, // lookAt ({ x, y, z })
        3000 // ms transition duration
      );
    };

    // 增加节点
    const addNode = () => {
      console.log('增加')
    };

    // 初始化数据
    const initGraphData = () => {
      getNeuronNode().then((res) => {
        if(res.code === 200) {
          const nodes = res.data
          initData.value.nodes = nodes
          Graph.value.graphData(initData.value)
        }
      });
    }

    watch(currentNode, (newVal, oldVal) => {
      if (newVal && !oldVal) {
        transitionName.value = "zoomIn";
      }
      if (!newVal && oldVal) {
        transitionName.value = "zoomOut";
      }
    });

    onMounted(() => {
      // 预加载纹理
      const textureLoader = new THREE.TextureLoader(manager);
      const loadedMaterials = preloadMaterials(textureLoader, materialMap);
      // 创建3D图形
      Graph.value = ForceGraph3D({ controlType: "trackball" })(
        document.getElementById("3d-graph")
      )
        .showNavInfo(false)
        .nodeResolution(16)
        .nodeColor((node) => getNodeColor(node, nodeColorScale))
        .linkThreeObject((link) => createLinkObject(link, nodeColorScale))
        .backgroundColor("rgba(0,0,0,0)")
        .onNodeClick((node) => {
          focusOnNode();
        })
        .nodeOpacity(0.85)
        .onNodeHover((node) => {
          if (node) {
            const position = Graph.value.graph2ScreenCoords(
              node.x,
              node.y,
              node.z
            );
            selectedNode.value = node;
            currentNode.value = {
              id: node.id, // 节点信息
              coverImg: node.coverImg, // 节点封面图片
              contentImg: node.contentImg, // 节点图片
            };
            nextTick(() => {
              // 等待 DOM 更新
              if (nodeInfoRef.value && nodeInfoRef.value.$el) {
                const halfWidth = nodeInfoRef.value.$el.clientWidth / 2;
                const halfHeight = nodeInfoRef.value.$el.clientHeight / 2;

                currentPosition.value = {
                  x: position.x,
                  y: position.y,
                  halfHeight: halfHeight,
                  halfWidth: halfWidth,
                };
              } else {
                currentPosition.value = {
                  x: position.x,
                  y: position.y,
                };
              }
            });
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

    // 初始化数据
    initGraphData()

    return {
      Graph,
      currentNode,
      currentPosition,
      nodeInfoRef,
      focusOnNode,
      transitionName,
      addNode,
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

.zoomIn-enter-active,
.zoomIn-leave-active {
  animation: zoomIn 0.5s;
}
.zoomOut-enter-active,
.zoomOut-leave-active {
  animation: zoomOut 0.5s;
}
</style>
