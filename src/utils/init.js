import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import * as THREE from "three";
import * as d3 from "d3";

// 创建LoadingManager对象
function createLoadingManager() {
  const manager = new THREE.LoadingManager();
  manager.onProgress = (url, itemsLoaded, itemsTotal) => {
    document.getElementById("progress").style.width = `${
      (itemsLoaded / itemsTotal) * 100
    }%`;
  };
  manager.onLoad = () => {
    document.getElementById("loading-screen").style.display = "none";
  };
  return manager;
}
// 监听浏览器窗口变化
function updateSize(Graph) {
  Graph.value.width(window.innerWidth);
  Graph.value.height(window.innerHeight);
}
// 预加载纹理
function preloadMaterials(textureLoader, materialMap) {
  const loadedMaterials = {};
  for (const key in materialMap) {
    const materials = materialMap[key];
    loadedMaterials[key] = {
      albedo: textureLoader.load(materials.albedo),
      normal: textureLoader.load(materials.normal),
      height: textureLoader.load(materials.height),
      metallic: textureLoader.load(materials.metallic),
    };
  }
  return loadedMaterials;
}
// 设置节点颜色
function getNodeColor(node, nodeColorScale) {
  return nodeColorScale(node.id);
}
// 创建连接线
function createLinkObject(link, nodeColorScale) {
  const colors = new Float32Array(
    [].concat(
      ...[link.source, link.target]
        .map(nodeColorScale)
        .map(d3.color)
        .map(({ r, g, b }) => [r, g, b].map((v) => v / 255))
    )
  );

  const material = new THREE.LineBasicMaterial({ vertexColors: true });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(2 * 3), 3)
  );
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  return new THREE.Line(geometry, material);
}
// 创建节点
function getNodeThreeObject(node, loadedMaterials) {
  const materials = loadedMaterials[node.material];
  const sphereMaterial = materials
    ? new THREE.MeshStandardMaterial({
        map: materials.albedo,
        normalMap: materials.normal,
        displacementMap: materials.height,
        displacementScale: 0.2,
        metalnessMap: materials.metallic,
      })
    : new THREE.MeshStandardMaterial({ color: "red" });

  return new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), sphereMaterial);
}
// 创建后期处理效果
function addPostProcessingEffects(Graph) {
  // bloom效果
  const bloomPass = new UnrealBloomPass();
  bloomPass.strength = 0.4;
  bloomPass.radius = 0.5;
  bloomPass.threshold = 0.1;
  Graph.value.postProcessingComposer().addPass(bloomPass);

  // 抗锯齿效果
  const smaaPass = new SMAAPass();
  smaaPass.renderToScreen = true;
  Graph.value.postProcessingComposer().addPass(smaaPass);
}

export {
  createLoadingManager,
  updateSize,
  preloadMaterials,
  getNodeColor,
  createLinkObject,
  getNodeThreeObject,
  addPostProcessingEffects,
};
