<script setup lang="ts">
import { GridLayout, GridItem } from 'grid-layout-plus';
import { reactive } from 'vue';

const layout = reactive([
	{ x: 0, y: 0, w: 2, h: 2, i: '0', static: false },
	{ x: 2, y: 0, w: 2, h: 4, i: '1', static: true },
	{ x: 4, y: 0, w: 2, h: 5, i: '2', static: false },
	{ x: 6, y: 0, w: 2, h: 3, i: '3', static: false },
	{ x: 8, y: 0, w: 2, h: 3, i: '4', static: false },
	{ x: 10, y: 0, w: 2, h: 3, i: '5', static: false },
	{ x: 0, y: 5, w: 2, h: 5, i: '6', static: false },
	{ x: 2, y: 5, w: 2, h: 5, i: '7', static: false },
	{ x: 4, y: 5, w: 2, h: 5, i: '8', static: false },
	{ x: 6, y: 3, w: 2, h: 4, i: '9', static: true },
	{ x: 8, y: 4, w: 2, h: 4, i: '10', static: false },
	{ x: 10, y: 4, w: 2, h: 4, i: '11', static: false },
	{ x: 0, y: 10, w: 2, h: 5, i: '12', static: false },
	{ x: 2, y: 10, w: 2, h: 5, i: '13', static: false },
	{ x: 4, y: 8, w: 2, h: 4, i: '14', static: false },
	{ x: 6, y: 8, w: 2, h: 4, i: '15', static: false },
	{ x: 8, y: 10, w: 2, h: 5, i: '16', static: false },
	{ x: 10, y: 4, w: 2, h: 2, i: '17', static: false },
	{ x: 0, y: 9, w: 2, h: 3, i: '18', static: false },
	{ x: 2, y: 6, w: 2, h: 2, i: '19', static: false },
]);
</script>

<template>
	<grid-layout
		v-model:layout="layout"
		:row-height="30"
	>
		<template #item="{ item }">
			<span class="text">{{ `${item.i}${item.static ? '- Static' : ''}` }}</span>
		</template>
	</grid-layout>
</template>

<style scoped>
.vgl-layout {
	background-color: #eeeeee;
}

:deep(.vgl-item:not(.vgl-item--placeholder)) {
	background-color: #cccccc;
	border: 1px solid black;
}

:deep(.vgl-item--resizing) {
	opacity: 0.9;
}

:deep(.vgl-item--static) {
	background-color: #ccccee;
}

.text {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	margin: auto;
	font-size: 24px;
	text-align: center;
}
</style>
