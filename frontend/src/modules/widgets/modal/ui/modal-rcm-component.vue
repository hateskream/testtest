<script setup lang="ts">
import { computed } from 'vue';

import type { IModalRcmPositions } from '../model';

interface IRcmProps {
	positions: IModalRcmPositions;
}

const props = defineProps<IRcmProps>();

const positionsStyles = computed(() => ({
	top: `${props.positions.y}px`,
	left: `${props.positions.x}px`,
}));
</script>

<template>
	<div
		:class="classes.container"
		:style="positionsStyles"
	>
		<div :class="classes.title">
			<slot name="title" />
		</div>

		<div :class="classes.content">
			<slot name="content" />
		</div>
	</div>
</template>

<style module="classes">
.container {
	position: absolute;
	z-index: 101;
	min-width: 208px;
	padding: 6px;
	background: var(--bg-modal-color-base);
	border: 1px solid var(--border-modal-color-base);
	border-radius: 18px;
}

.title {
	display: flex;
	align-items: center;
	width: max-content;
	padding: 12px;
	font-weight: 300;
	font-size: 13px;
	color: var(--text-color-base-300);
	gap: 4px;
}
</style>
