function loadMaterial(type) {
    return {
      albedo: require(`@/assets/materials/${type}/${type}_AlbedoSmoothness.png`),
      normal: require(`@/assets/materials/${type}/${type}_Normal.png`),
      height: require(`@/assets/materials/${type}/${type}_Height.png`),
      metallic: require(`@/assets/materials/${type}/${type}_MetallicSmoothness.png`),
    };
  }
  
  const materialTypes = [
    'SGT_Autumn_Ground_1',
    'SGT_Ice_1',
    'SGT_Flowers_1',
    // 未来可以继续添加新的类型
  ];
  
  const materialMap = materialTypes.reduce((acc, type) => {
    acc[type] = loadMaterial(type);
    return acc;
  }, {});
  
  export default materialMap;