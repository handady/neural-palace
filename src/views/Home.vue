<template>
    <div id="3d-graph"></div>
</template>

<script>
import { onMounted, ref } from 'vue';
import ForceGraph3D from '3d-force-graph';

export default {
    setup() {
        const Graph = ref(null);

        onMounted(() => {
            // Random tree
            const N = 300;
            const gData = {
                nodes: [...Array(N).keys()].map(i => ({ id: i })),
                links: [...Array(N).keys()]
                    .filter(id => id)
                    .map(id => ({
                        source: id,
                        target: Math.round(Math.random() * (id - 1))
                    }))
            };

            Graph.value = ForceGraph3D()(document.getElementById('3d-graph'))
                .graphData(gData)
                .onNodeClick(node => {
                    // Aim at node from outside it
                    const distance = 40;
                    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

                    const newPos = node.x || node.y || node.z
                        ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
                        : { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)

                    Graph.value.cameraPosition(
                        newPos, // new position
                        node, // lookAt ({ x, y, z })
                        3000  // ms transition duration
                    );
                });
        });

        return {
            Graph,
        };
    },
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
</style>