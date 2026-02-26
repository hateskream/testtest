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
		<div v-if="$slots.leftCol" :class="[classes.column, classes.scrollable]">
			<slot name="leftCol"></slot>
		</div>
		<div v-if="$slots.rightCol" :class="[classes.column, classes.scrollable]">
			<slot name="rightCol"></slot>
		</div>
		<div v-if="$slots.mainCol" :class="[classes.column, classes.scrollable]">
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

.column {
	flex-shrink: 0;
	width: 100%;
}

.scrollable {
	scrollbar-width: none;
	-ms-overflow-style: none;
}

.scrollable::-webkit-scrollbar {
	display: none;
}
</style>
