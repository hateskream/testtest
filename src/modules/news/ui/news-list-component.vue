<script setup lang="ts">
import { type ComponentPublicInstance, ref, useTemplateRef } from 'vue';

import type { IDisplaySettings, INews } from '../model';
import { ListSkeleton } from '@/modules/widgets/base';

import NewsComponent from './news-component.vue';

interface IViewNewsComponentProps {
	news: INews[];
	isLoading?: boolean;
	displaySettings: IDisplaySettings;
	displayVariant: 'tv' | 'dashboard';
	maxCountRowTablet?: number;
}

const props = withDefaults(defineProps<IViewNewsComponentProps>(), {
	maxCountRowTablet: Infinity,
});

const emits = defineEmits<{
	next: [];
	'select-news': [{ id: string; slug: string }];
}>();

const scrollerRef = useTemplateRef('scroller');

const newsRef = ref<ComponentPublicInstance[]>([]);

let ticking = false;

function checkBottom(el: HTMLElement) {
	const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;

	if (remaining <= 450) {
		emits('next');
	}
}

function handleScroll(event: Event) {
	if (ticking) {
		return;
	}

	ticking = true;

	requestAnimationFrame(() => {
		const el = event.target as HTMLElement | null;

		if (el) {
			checkBottom(el);
		}

		ticking = false;
	});
}

function scrollBy(px: number) {
	if (!scrollerRef.value) {
		return;
	}

	scrollerRef.value.scrollTop += px;

	checkBottom(scrollerRef.value);
}

function calcMaxCountRowVisible(height: number) {
	return calcMaxRowVisible(height).count;
}


function calcMaxRowVisible(height: number) {

	if (!newsRef.value) {
		return { count: 0, height: 0 };
	}

	let count = 0;
	let acc = 0;

	while (true) {
		const el = newsRef.value[count];
		if (!el) {
			break;
		}

		const elHeight = el.$el.clientHeight;

		if (acc + elHeight > height) {
			break;
		}

		acc += elHeight;
		count += 1;
	}

	return { count, height: acc };
}

function snapHeightToNearestStep(height: number) {
	if (!newsRef.value) {
		return 0;
	}

	const { height: heightOccupiedByContent, count: indexLastElement } = calcMaxRowVisible(height);

	const delta = height - heightOccupiedByContent;

	const el = newsRef.value[indexLastElement];
	if (!el) {
		return heightOccupiedByContent;
	}

	const elHeight = el.$el.clientHeight;

	if (delta > elHeight / 2) {
		return heightOccupiedByContent + elHeight;
	} else {
		return heightOccupiedByContent;
	}
}

defineExpose({ scrollBy, calcMaxCountRowVisible, snapHeightToNearestStep });
</script>

<template>
	<div :class="classes.root">
		<div
			ref="scroller"
			:class="classes.scrollable"
			:style="{
				overflowY: Number.isFinite(props.maxCountRowTablet) ? 'hidden' : 'auto',
			}"
			@scroll="handleScroll"
		>
			<div
				:class="classes.content"
				:style="props.displayVariant === 'dashboard' && {padding: `4px`}"
			>
				<div v-if="props.isLoading" :class="classes.skeletonWrapper">
					<list-skeleton />
				</div>

				<template v-else>
					<news-component
						v-for="(item, index) in props.news"
						:ref="(el) => newsRef[index] = (el as ComponentPublicInstance)"
						:key="item.id"
						:news="item"
						:display-settings="props.displaySettings"
						:display-variant="props.displayVariant"
						:style="{
							visibility: index < props.maxCountRowTablet ? 'visible' : 'hidden',
						}"
						@click="emits('select-news', { id: item.id, slug: item.slug })"
					/>
				</template>
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
	min-height: 0;
	overflow-x: hidden;
	overflow-y: auto;
}

.content {
	width: 100%;
	height: auto;
}

.skeletonWrapper {
	padding: 0 12px;
}
</style>
