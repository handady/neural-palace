export const getNextIndex = (positions) => {
  let index = 0;
  const existingIndices = positions.map((p) => p.index).sort((a, b) => a - b);

  for (const existingIndex of existingIndices) {
    if (index !== existingIndex) break;
    index++;
  }

  return index;
};
 