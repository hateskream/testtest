<script setup lang="ts">
import { useTemplateRef } from 'vue';

import type { IDisplaySettings, INews } from '../model';

import NewsComponent from './news-component.vue';

interface IViewNewsComponentProps {
	news: INews[];
	displaySettings: IDisplaySettings;
	displayVariant: 'tv' | 'dashboard';
}

const props = defineProps<IViewNewsComponentProps>();

const emits = defineEmits<{
	next: [];
	'select-news': [{ id: string; slug: string }];
}>();

const scrollerRef = useTemplateRef('scroller');

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

defineExpose({ scrollBy });
</script>

<template>
	<div :class="classes.root">
		<div
			ref="scroller"
			:class="classes.scrollable"
			@scroll="handleScroll"
		>
			<div :class="classes.content">
				<news-component
					v-for="item in props.news"
					:key="item.id"
					:news="item"
					:display-settings="props.displaySettings"
					:display-variant="props.displayVariant"
					@click="emits('select-news', { id: item.id, slug: item.slug })"
				/>
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
</style>
