<script setup lang="ts">
import { computed, type Ref, ref } from 'vue';

type ViewMode = 'mixed' | 'reports';
import { useCustomScroll } from '@/shared/composables/scroll.ts';


const contentShift = ref(0);
const topContentEl = ref<HTMLElement>();
const container = ref<HTMLElement>();
const viewMode = ref<ViewMode>('mixed');

const emit = defineEmits<{
	(event: 'change-view', value: ViewMode): void;
	(event: 'animation-start'): void;
	(event: 'animation-end'): void;
}>();

const maxShift = computed(()=>{
	return topContentEl.value?.offsetHeight;
});
useCustomScroll(container as Ref<HTMLElement | null>, (delta)=>{
	if (!maxShift.value) {
		return;
	}
	const autoScrollThreshold = maxShift.value/5;
	if (delta > 0&&(contentShift.value+delta)>autoScrollThreshold) {
		contentShift.value = maxShift.value;
		viewMode.value = 'reports';
		emit('change-view', 'reports');
		emit('animation-start');
		setTimeout(() => {
			emit('animation-end');
		}, 1000);
		return;
	}
	if (delta < 0&&(contentShift.value+delta)<(maxShift.value-autoScrollThreshold)) {
		contentShift.value = 0;
		viewMode.value = 'mixed';
		emit('change-view', 'mixed');
		return;
	}
	contentShift.value = Math.max(0, Math.min(maxShift.value, contentShift.value+delta));
});

const opacityTop = computed(()=>{
	if (!maxShift.value||!contentShift.value) {
		return 1;
	}
	return 1-contentShift.value/maxShift.value;
});


const setMixedViewMode = () => {
	contentShift.value = 0;
	viewMode.value = 'mixed';
	emit('change-view', 'mixed');
};
const setReportsViewMode = async () => {
	if (!container.value) {
		return;
	}
	if (topContentEl.value) {
		contentShift.value = topContentEl.value.offsetHeight;
	}
	viewMode.value = 'reports';
	emit('change-view', 'reports');
};
defineExpose({ setMixedViewMode, setReportsViewMode });

</script>

<template>
	<div ref="container" :class="classes.root">
		<div
			ref="topContentEl"
			:class="classes.topContent"
			:style="{opacity:`${opacityTop}`}"
		>
			<slot name="header"></slot>
			<slot name="topContent">Graph</slot>
		</div>
		<div
			ref="botContentEl"
			:class="[classes.botContent,{[classes.locked]:viewMode!=='reports'}]"
			:style="{transform: `translateY(-${contentShift}px)`}"
		>
			<slot name="botContent">
			</slot>
		</div>
	</div>
</template>

<style module="classes">
.root {
	width: 100%;
	height: 100vh;
}

.topContent {
	padding-bottom: 26px;
	border-bottom: 2px solid var(--border-color-surface-02);
	opacity: 1;
	transition: opacity 0.5s ease-in-out;
}

.botContent {
	padding-top: 35px;
	transition: 0.4s ease-in-out;
}

.locked {
	pointer-events: none;
}

</style>
