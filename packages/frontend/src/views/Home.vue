<template>
  <div>
    <div id="loading-screen">
      <div class="loader">在加载了( ๑ŏ ﹏ ŏ๑ )别催我</div>
      <div id="progress-bar">
        <div id="progress"></div>
      </div>
    </div>
    <div class="newGroup">
      <WaterButton
        :value="'新增组'"
        colorType="pink"
        @click="showAddNewGroup = true"
      />
    </div>
    <AddNewGroup
      class="addNewGroup"
      v-if="showAddNewGroup"
      @cancel="showAddNewGroup = false"
      @modifySuccess="initGraphData"
    />
    <transition :name="transitionName">
      <NodeInfo
        v-if="currentNode"
        :node="currentNode"
        :position="currentPosition"
        :coverImgUrl="coverImgUrl"
        :contentImgUrl="contentImgUrl"
        @focusOnNode="focusOnNode"
        @modifySuccess="initGraphData"
        ref="nodeInfoRef"
      />
    </transition>
    <div id="3d-graph"></div>
  </div>
</template>

<script>
import { onMounted, ref, onUnmounted, watch, nextTick } from "vue";
import ForceGraph3D from "3d-force-graph";
import * as THREE from "three";
import { createStars, createUniverse } from "@/utils/functions"; // 导入相关函数
import { getNeuronNode } from "@/api/neuronNode";
import { getNeuronLink } from "@/api/neuronLink";
import NodeInfo from "@/components/NodeInfo.vue";
import WaterButton from "../components/WaterButton.vue";
import AddNewGroup from "@/components/AddNewGroup.vue";
import "animate.css";
import universeImg from "@/assets/银河全景.jpg";
import materialMap from "@/configs/materialConfigs"; // 单独配置的材质配置文件
import starConfigs from "@/configs/starConfigs"; // 单独配置的星星配置文件
import {
  createLoadingManager,
  updateSize,
  preloadMaterials,
  createLinkObject,
  getNodeThreeObject,
  addPostProcessingEffects,
} from "@/utils/init"; // 导入相关函数
import { getObject } from "@/api/utils";

export default {
  components: { NodeInfo, WaterButton, AddNewGroup },
  setup() {
    // 创建变量
    const [
      Graph,
      currentNode,
      currentPosition,
      selectedNode,
      nodeInfoRef,
      coverImgUrl,
      contentImgUrl,
      previousCoverId,
      showAddNewGroup,
    ] = [
      ref(null),
      ref(null),
      ref(null),
      ref(null),
      ref(null),
      ref(""),
      ref(""),
      ref(""),
      ref(false),
    ];
    const initData = ref({
      nodes: [],
      links: [],
    });
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

    // 初始化数据
    const initGraphData = async () => {
      const nodePromise = getNeuronNode();
      const linkPromise = getNeuronLink();

      try {
        const [nodeRes, linkRes] = await Promise.all([
          nodePromise,
          linkPromise,
        ]);
        if (nodeRes.code === 200) {
          initData.value.nodes = nodeRes.data;
        }
        if (linkRes.code === 200) {
          initData.value.links = linkRes.data;
        }
        // 一次性更新图数据
        if (nodeRes.code === 200 && linkRes.code === 200) {
          Graph.value.graphData(initData.value);
        }
      } catch (error) {
        console.error("Failed to fetch graph data: ", error);
      }
    };

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
        .linkThreeObject((link) => createLinkObject(link, initData.value.nodes))
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
            if (node.id !== previousCoverId.value) {
              coverImgUrl.value = "";
              contentImgUrl.value = "";
              getObject({
                filePath: node.coverImg,
              }).then((res) => {
                if (res.code === 200) {
                  coverImgUrl.value = res.data;
                }
              });
              getObject({
                filePath: node.contentImg,
              }).then((res) => {
                if (res.code === 200) {
                  contentImgUrl.value = res.data;
                }
              });
            }
            currentNode.value = {
              id: node.id, // 节点信息
              coverImg: node.coverImg, // 节点封面图片
              contentImg: node.contentImg, // 节点图片
              color: node.color, // 节点颜色
              material: node.material, // 节点材质
              group: node.group, // 节点分组
            };
            previousCoverId.value = node.id;
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
    initGraphData();

    return {
      Graph,
      currentNode,
      currentPosition,
      nodeInfoRef,
      focusOnNode,
      transitionName,
      initGraphData,
      coverImgUrl,
      contentImgUrl,
      previousCoverId,
      showAddNewGroup,
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
      mesh.rotation.y += 0.00005;
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
.newGroup {
  position: fixed;
  z-index: 10;
  top: 5%;
  right: 0;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.addNewGroup {
  position: fixed;
  z-index: 10;
  width: 30%;
  max-width: 512px;
  max-height: 768px;
  height: 70%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
