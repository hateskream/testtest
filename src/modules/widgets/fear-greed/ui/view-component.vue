<script setup lang="ts">
import { computed } from 'vue';

import { type ISettings, type ISize, type ITension, type ITensionTextData } from '../model';
import { useMapTension } from '../composables';

import FearGreedHistoryTable from './shared/fear-greed-history-table.vue';
import FearGreedMetric from './shared/fear-greed-metric.vue';
import FearGreedDescription from './shared/fear-greed-description.vue';

export interface IViewComponentProps {
	tension: ITension;
	viewState: ISettings;
	size: ISize;
	displayVariant: 'new' | 'default';
	columnWidth?: number;
}

export interface IViewComponentEmits {
	(e: 'updateInteractive'): void;
}

const props = defineProps<IViewComponentProps>();
const emits = defineEmits<IViewComponentEmits>();

const { mapTension } = useMapTension();

const tensionText = computed<ITensionTextData>(
	() => mapTension(props.tension.tension ?? 0),
);

const history = computed(() =>
	(props.tension.history ?? []).map(item => ({
		style: { color: mapTension(item.value).colors.text },
		name: item.displayName,
		tension: item.value,
	})),
);

const isShowDescription = computed(() => props.viewState.isShowDescription && props.size.h > 2);
const isShowChart = computed(() => props.viewState.isShowChart && props.size.h > 2);
const isShowPastValues = computed(() => {
	return (
		history.value.length > 0 &&
		props.viewState.isShowPastValues &&
		(props.size.h > 4 || (props.size.w >= 2 && props.size.h > 2))
	);
});

const MIN_CONTENT_HEIGHT = 170;
const MAX_CONTENT_HEIGHT = 280;
const STEP = 90;
const WIDTH_THRESHOLD = 400;

function snapHeightToNearestStep(contentHeight: number): number {
	// FUCK U! WTF IS GOIN ON WITH COLUMN WIDTH AND SIZE.W
	const widgetWidth = (props.columnWidth ?? 0) * props.size.w;

	if (widgetWidth >= WIDTH_THRESHOLD) {
		return MIN_CONTENT_HEIGHT;
	}

	const middlePoint = MIN_CONTENT_HEIGHT + STEP / 2;
	if (contentHeight < middlePoint) {
		return MIN_CONTENT_HEIGHT;
	} else {
		return MAX_CONTENT_HEIGHT;
	}
}

defineExpose({ snapHeightToNearestStep });
</script>

<template>
	<div :class="classes.container">
		<div
			:class="classes.metric"
			@click.stop.prevent="emits('updateInteractive')"
		>
			<fear-greed-metric
				v-if="isShowChart"
				:tension="props.tension"
				:text="tensionText"
				@update-interactive="emits('updateInteractive')"
			/>

			<fear-greed-description
				:tension="props.tension"
				:view-state="props.viewState"
				:text="tensionText"
				:size="props.size"
				:show-description="isShowDescription"
			/>
		</div>

		<fear-greed-history-table
			:history="history"
			:show="isShowPastValues"
		/>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	width: 100%;
	margin-top: 12px;
	gap: 25px 32px;
}

.metric {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 180px;
}
</style>
