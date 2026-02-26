<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';

import { useTickerLayoutTouchScroll } from '../../composables';

export interface IProps {
	disableScroll?: boolean;
}

const props = defineProps<IProps>();

useTickerLayoutTouchScroll(
	useTemplateRef('container'),
	{ disabled: toRef(props, 'disableScroll') },
);
</script>

<template>
	<div ref="container" :class="[classes.root, classes.scrollable]">
		<div :class="classes.topRow">
			<div :class="[classes.side, classes.scrollable]">
				<slot name="leftCol"></slot>
			</div>
			<div :class="[classes.side, classes.scrollable]">
				<slot name="rightCol"></slot>
			</div>
		</div>
		<div v-if="$slots.mainCol" :class="[classes.mainRow, classes.scrollable]">
			<slot name="mainCol"></slot>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: calc(100svh - 16px);
	padding-bottom: 10px;
	overflow-x: hidden;
	overflow-y: auto;
}

.topRow {
	display: flex;
	flex-shrink: 0;
}

.mainRow {
	display: flex;
	flex-shrink: 0;
	flex-direction: column;
	padding: 0 var(--padding-s5, 8px);
}

.side {
	flex: 1;
	width: 50%;
	padding: 0 var(--padding-s5, 8px) 10px;
}

.scrollable {
	scrollbar-width: none;
	-ms-overflow-style: none;
}

.scrollable::-webkit-scrollbar {
	display: none;
}
</style>
