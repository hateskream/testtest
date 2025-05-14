<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {useElementBounding, useScroll} from '@vueuse/core'

type ViewMode = 'mixed' | 'reports';

const viewMode = ref<ViewMode>('mixed');

const contentShift = ref(0);
const botContentEl = ref<HTMLElement>();
const topContentEl = ref<HTMLElement>();
const container = ref<HTMLElement>();
const {y: scrollY} = useScroll(container);
const {top: botTopAbsolute} = useElementBounding(botContentEl);
const {top: containerTopAbsolute} = useElementBounding(container);


const top = computed(() => botTopAbsolute.value - containerTopAbsolute.value);

const emit = defineEmits<{
	(event: 'change-view', value: ViewMode): void;
}>();
const setMixedViewMode = () => {
	viewMode.value = 'mixed';
	contentShift.value = 0;
	emit('change-view', viewMode.value);
}
const setReportsViewMode = async () => {
	viewMode.value = 'reports';
	if (!container.value) {
		return;
	}
	if (topContentEl.value) {
		contentShift.value = -topContentEl.value.offsetHeight;
	}
	container.value.scrollTo(0, 1)
	emit('change-view', viewMode.value);
}
defineExpose({setMixedViewMode, setReportsViewMode})

const lastScroll = ref(0);
watch(scrollY, (val) => {
	lastScroll.value = val;
	const center = window.innerHeight / 2
	const currentTop = top.value
	const threshold = window.innerHeight / 20;
	if (currentTop < center + threshold && viewMode.value === 'mixed') {
		setReportsViewMode();
	} else if (val === 0 && viewMode.value === 'reports') {
		setMixedViewMode()
	}
})

</script>

<template>
	<div ref="container" :class="classes.root">
		<div ref="topContentEl" :class="[classes.topContent, viewMode === 'reports'?classes.hidden:'']">
			<slot name="header"></slot>
			<slot name="topContent">Graph</slot>
		</div>
		<div ref="botContentEl" :class="classes.botContent" :style="{transform: `translateY(${contentShift}px)`}">
			<slot name="botContent">
			</slot>
		</div>
	</div>
</template>

<style module="classes">
.root {
	height: 100vh;
	overflow: scroll;
}

.topContent {
	padding-bottom: 26px;
	border-bottom: 2px solid var(--border-color-surface-02);
	transition: 0.5s ease-in-out;
}

.hidden {
	width: 100%;
	opacity: 0;
}

.botContent {
	padding-top: 35px;
	transition: 0.5s ease-in-out;
}

</style>
