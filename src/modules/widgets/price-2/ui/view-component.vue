<script setup lang="ts">
import type { IMeta } from '@/modules/dashboard-group/core';

import CellComponent from './cell-component.vue';

interface IViewComponentProps {
	meta: IMeta;
}

defineProps<IViewComponentProps>();
</script>

<template>
	<div :class="classes.root">
		<div :class="classes.scrollable">
			<div :class="classes.content">
				<cell-component :meta="meta" />
			</div>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
}

.scrollable {
	position: relative;
	flex: 1;
	overflow-x: hidden;
	overflow-y: auto;
}

.content {
	width: 100%;
	height: auto;
}
</style>

<style scoped>
:deep(.vgl-item--placeholder) {
	background: transparent !important;
}
</style>
