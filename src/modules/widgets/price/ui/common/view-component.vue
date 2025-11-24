<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';

import { type IDisplaySettings, type ITicker } from '../../model';
import type { IMeta } from '@/modules/dashboard-group';
import { type IInfiniteStateHandler, UiInfiniteLoading } from '@/shared/ui/infinite-loading';
import { UiSkeleton } from '@/shared/ui/skeleton';

import CellComponent from './cell-component.vue';

interface IViewComponentProps {
	tickers: ITicker[];
	settings: IDisplaySettings;
	meta: IMeta;
	hasPin: boolean;
	hasInfinityLoading: boolean;
	displayVariant: 'new' | 'default';
}

const props = defineProps<IViewComponentProps>();

const emit = defineEmits<{
	(e: 'toggle-pin', tickerId: string): void;
	(e: 'load-more', state: IInfiniteStateHandler): void;
}>();

const gridTemplateContent = computed(() => {
	const defaultMinWidth = props.meta.size.w > 1 ? 190 : 100;

	let minWidth = defaultMinWidth + ((
		(+(props.settings.isShowChart && props.meta.size.w > 1)) +
		+props.settings.isShowPercentageChange +
		(+(props.settings.isShowLogo && props.meta.size.w > 1)) +
		+props.settings.isShowTicker +
		+props.settings.isShowDescription
	) * 30);

	return `repeat(auto-fit, minmax(${minWidth}px, 1fr)) `;
});

const scroller = useTemplateRef('scroller');

const loadingDistance = computed(() => {
	if (props.meta.size.h > 8) {
		return 300;
	}

	if (props.meta.size.h > 4) {
		return 100;
	}

	return 50;
});

const loadingSkeletonCount = computed(() => {
	return Math.ceil(props.meta.size.w / 2) || 1;
});

function scrollBy(px: number) {
	if (!scroller.value) {
		return;
	}

	scroller.value.scrollTop += px;
}

defineExpose({ scrollBy });
</script>

<template>
	<div :class="classes.root">
		<slot name="header" />
		<div ref="scroller" :class="classes.scrollable">
			<div :class="classes.content">
				<div
					:class="classes.contentWrapped"
				>
					<cell-component
						v-for="ticker in props.tickers"
						:key="ticker.tickerId"
						:settings="props.settings"
						:ticker="ticker"
						:meta="meta"
						:has-pin="props.hasPin"
						:display-variant="props.displayVariant"
						@toggle-pin="emit('toggle-pin', $event)"
					/>
				</div>
			</div>
			<ui-infinite-loading
				v-if="props.tickers.length && scroller && props.hasInfinityLoading"
				:distance="loadingDistance"
				:scroller="(scroller)!"
				@infinite="emit('load-more', $event)"
			>
				<template #loader>
					<div :class="classes.loader">
						<ui-skeleton
							v-for="key in loadingSkeletonCount"
							:key="key"
							height="60px"
							border-radius="16px"
						/>
					</div>
				</template>
			</ui-infinite-loading>
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
	flex: 1;
	min-height: 0;
	padding-bottom: 50px;
	overflow-x: hidden;
	overflow-y: auto;
}

.content {
	width: 100%;
	height: auto;
}

.contentWrapped {
	display: grid;
	grid-template-columns: v-bind(gridTemplateContent);
	width: 100%;
}

.loader {
	display: flex;
	gap: 10px;
	margin-bottom: 16px;
	padding: 0 0 0 8px;
}
</style>
