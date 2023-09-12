import * as THREE from "three";

const createStars = (
  config,
  textureLoader = new THREE.TextureLoader()
) => {
  let stars = config.numStars * config.ratio;
  const positions = [];
  // 星辰几何体
  const starsGeometry = new THREE.BufferGeometry();
  // 添加星辰的颜色与位置
  for (let i = 0; i < stars; i++) {
    const randomFactor =
      config.range[0] + Math.random() * (config.range[1] - config.range[0]); // 随机因子
    const sphereRadius = config.radius * randomFactor; // 球体半径乘以随机因子
    const phi = Math.random() * 2 * Math.PI; // 经度
    const theta = Math.random() * Math.PI; // 纬度

    const vertex = new THREE.Vector3();
    vertex.x = sphereRadius * Math.sin(theta) * Math.cos(phi);
    vertex.y = sphereRadius * Math.sin(theta) * Math.sin(phi);
    vertex.z = sphereRadius * Math.cos(theta);

    positions.push(vertex.x, vertex.y, vertex.z);
  }
  starsGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  // 星辰材质
  const starsMaterial = new THREE.PointsMaterial({
    map: textureLoader.load(config.image),
    size: config.size,
    blending: THREE.AdditiveBlending,
    fog: true,
    depthTest: true,
  });
  // 星辰的集合
  const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
  return starsMesh;
};

const createUniverse = (
  image,
  textureLoader = new THREE.TextureLoader()
) => {
  const universeGeometry = new THREE.SphereGeometry(50000, 200, 200);
  const universeMaterial = new THREE.MeshLambertMaterial({
    map: textureLoader.load(image),
    side: THREE.DoubleSide,
  });
  const universeMesh = new THREE.Mesh(universeGeometry, universeMaterial);
  return universeMesh;
};

export { createStars, createUniverse };
