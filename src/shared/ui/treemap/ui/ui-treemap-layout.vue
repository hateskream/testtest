<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { toRefs } from 'vue';

import { useTreemapLayout } from '../composable';

interface IDataItem {
	id: string;
	value: number;
}

interface IUiTreemap {
	data: IDataItem[];
}

const props = defineProps<IUiTreemap>();

const { treemap } = useTreemapLayout(
	useTemplateRef<HTMLCanvasElement>('treemapCanvas'),
	toRefs(props).data,
);
</script>

<template>
	<div :class="classes.root">
		<canvas ref="treemapCanvas" :class="classes.hidden"></canvas>
		<div :class="classes.treemap">
			<div
				v-for="item in treemap"
				:key="item.id"
				:style="{
					left:item.left + 'px',
					top: item.top + 'px',
					width: item.width + 'px',
					height: item.height + 'px',
				}"
				:class="classes.item"
			>
				<slot :item="item" />
			</div>
		</div>
	</div>
</template>

<style module="classes">
.root {
	position: relative;
	height: 100%;
}

.treemap {
	position: absolute;
	width: 100%;
	height: 100%;
}

.hidden {
	position: absolute;
	z-index: -1;
	display: none;
}

.item {
	position: absolute;
}
</style>
