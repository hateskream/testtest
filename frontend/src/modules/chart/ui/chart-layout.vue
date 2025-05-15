<script setup lang="ts">
import { computed, type Ref, ref } from 'vue';

type ViewMode = 'mixed' | 'reports';
import {useCustomScroll} from '@/shared/composables/scroll.ts';

const viewMode = ref<ViewMode>('mixed');

const contentShift = ref(0);
const topContentEl = ref<HTMLElement>();
const container = ref<HTMLElement>();
const maxShift = computed(()=>{
	return topContentEl.value?.offsetHeight;
})
const {maxScroll} = useCustomScroll(container as Ref<HTMLElement | null>,(offset)=>{
	const scale = offset/maxScroll.value;
	if (!maxShift.value) {return }
	contentShift.value = -scale * maxShift.value;
})

const opacityTop = computed(()=>{
	if (!maxShift.value||!contentShift.value) {return 1;}
	return 1+contentShift.value/maxShift.value;
});

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
	emit('change-view', viewMode.value);
}
defineExpose({setMixedViewMode, setReportsViewMode})
// watch(scrollY, (val) => {
// 	lastScroll.value = val;
// 	const center = window.innerHeight / 2
// 	const currentTop = top.value
// 	const threshold = window.innerHeight / 20;
// 	if (currentTop < center + threshold && viewMode.value === 'mixed') {
// 		setReportsViewMode();
// 	} else if (val === 0 && viewMode.value === 'reports') {
// 		setMixedViewMode()
// 	}
// })

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
			ref="botContentEl" :class="classes.botContent"
			:style="{transform: `translateY(${contentShift}px)`}"
		>
			<slot name="botContent">
			</slot>
		</div>
	</div>
</template>

<style module="classes">
.root {
	height: 100vh;
}

.topContent {
	padding-bottom: 26px;
	border-bottom: 2px solid var(--border-color-surface-02);
	opacity: 1;
	transition: opacity 0.5s ease-in-out;
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
