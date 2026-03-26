<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';

import { UiText } from '@/shared/ui/text';
import { UiTag } from '@/shared/ui/tag';

const MAX_ROWS = 2;
const GAP_TOLERANCE = 4;

const props = defineProps<{
	cities: string[];
	showAll: boolean;
}>();

const containerRef = useTemplateRef('container');
const cityRefs = useTemplateRef('cities');

const visibleCount = ref(props.cities.length);
const overflowCount = computed(() => props.cities.length - visibleCount.value);

let lastWidth = 0;

function recalculate(): void {
	if (props.showAll) {
		visibleCount.value = props.cities.length;
		return;
	}

	const container = containerRef.value;

	if (!container) {
		return;
	}

	const currentWidth = container.clientWidth;

	if (currentWidth === lastWidth) {
		return;
	}
	lastWidth = currentWidth;

	const items = cityRefs.value?.map(
		v => v?.$el as HTMLDivElement,
	);

	if (!items?.length) {
		return;
	}

	for (const item of items) {
		item.style.display = '';
	}

	const firstTop = items[0].offsetTop;
	const rowHeight = items[0].getBoundingClientRect().height;
	const maxTop = firstTop + rowHeight * MAX_ROWS + GAP_TOLERANCE;

	let count = props.cities.length;

	for (let i = 0; i < items.length; i++) {
		if (items[i].offsetTop >= maxTop) {
			count = i;
			break;
		}
	}

	for (let i = count; i < items.length; i++) {
		items[i].style.display = 'none';
	}

	visibleCount.value = count;
}

const observer = new ResizeObserver(() => recalculate());

onMounted(async () => {
	await nextTick();
	recalculate();

	if (containerRef.value) {
		observer.observe(containerRef.value);
	}
});

onUnmounted(() => observer.disconnect());

watch(() => [props.cities, props.showAll], async () => {
	visibleCount.value = props.cities.length;
	lastWidth = 0;
	await nextTick();
	recalculate();
});
</script>

<template>
	<div ref="container" :class="classes.list">
		<ui-tag
			v-for="city in cities"
			:key="city"
			ref="cities"
			:class="classes.tag"
		>
			{{ city }}
		</ui-tag>
		<ui-tag v-if="overflowCount > 0">
			<ui-text token="text-200-r">+{{ overflowCount }}</ui-text>
		</ui-tag>
	</div>
</template>

<style module="classes">
.list {
	display: flex;
	flex: 1 0 0;
	flex-wrap: wrap;
	align-content: flex-start;
	align-items: center;
	padding: 5px var(--padding-padding-s6, 10px) 5px 0;
	gap: 2px;
}
</style>
