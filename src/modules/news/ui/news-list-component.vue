<script setup lang="ts">
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

let ticking = false;

function handleScroll(event: Event) {
	if (ticking) {
		return;
	}
	ticking = true;

	requestAnimationFrame(() => {
		const el = event.target as HTMLElement;

		if (!el) {
			ticking = false; return;
		}

		const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;

		if (remaining <= 450) {
			emits('next');
		}

		ticking = false;
	});
}
</script>

<template>
	<div :class="classes.root">
		<div :class="classes.scrollable" @scroll="handleScroll">
			<div :class="classes.content">
				<news-component
					v-for="item in props.news"
					:key="item.id"
					:news="item"
					:display-settings="props.displaySettings"
					:display-variant="props.displayVariant"
					@click="emits('select-news', {
						id: item.id,
						slug: item.slug,
					})"
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
}

.content {
	width: 100%;
	height: auto;
}
</style>
