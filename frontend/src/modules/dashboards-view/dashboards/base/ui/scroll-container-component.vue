<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';

interface IScrollContainerComponentProps {
	maxHeight?: number;
	overflowX?: CSSProperties['overflow-x'];
}

const props = withDefaults(defineProps<IScrollContainerComponentProps>(), {
	overflowX: 'auto',
});

const scrollStyles = computed<CSSProperties>(() => ({
	maxHeight: `${props.maxHeight}px`,
	overflowX: props.overflowX,
}));
</script>

<template>
	<div :class="classes.scrollWrapper">
		<div
			:class="classes.scrollContainer"
			:style="scrollStyles"
		>
			<slot name="content" />
		</div>

		<slot name="footer" />
	</div>
</template>

<style module="classes">
.scrollWrapper {
	position: relative;
	width: 100%;
}

.scrollContainer {
	position: relative;
	max-width: 100%;
	overflow-x: auto;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
	clip-path: inset(0 0 0 0);
}
</style>
