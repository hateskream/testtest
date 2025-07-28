<script setup lang="ts">
import { toRefs, useTemplateRef } from 'vue';

import { useTreemapLayout } from '../composable';


interface IUiTreemap {
	data: number[];
}

const props = defineProps<IUiTreemap>();

const { treemap } = useTreemapLayout(
	useTemplateRef<HTMLCanvasElement>('treemapCanvas'),
	toRefs(props).data,
);

</script>

<template>
	<div class="treemap-container">
		<canvas ref="treemapCanvas" class="hidden"></canvas>
		<div
			v-for="(item, index) in treemap"
			:key="index"
			:style="{
				left:item.left + 'px',
				top: item.top + 'px',
				width: item.width + 'px',
				height: item.height + 'px',
			}"
			class="item"
		/>
	</div>

</template>

<style scoped>
.treemap-container {
	position: relative;
	width: 100%;
	height: 800px;
}

.hidden {
	display: none;
}

.item {
	position: absolute;
	background-color: #ff4d4d;
	border: #333333 1px solid;
}
</style>
