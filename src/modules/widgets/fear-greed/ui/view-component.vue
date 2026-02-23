<script setup lang="ts">
import { computed } from 'vue';

import { type ISettings, type ISize, type ITension, type ITensionTextData, Tension } from '../model';
import { useMapTension } from '../composables';
import { type ISpeedometerSegment, UiSpeedometer, UiSpeedometerDescription } from '@/shared/ui/speedometer';

import FearGreedHistoryTable from './shared/fear-greed-history-table.vue';

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

const SPEEDOMETER_SEGMENTS: ISpeedometerSegment[] = [
	{ max: Tension.extremeFear.max, position: 1 },
	{ max: Tension.fear.max, position: 25 },
	{ max: Tension.neutral.max, position: 50 },
	{ max: Tension.greed.max, position: 75 },
	{ max: Tension.extremeGreed.max, position: 99 },
];

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
			<ui-speedometer
				v-if="isShowChart"
				:value="props.tension.tension"
				:color="tensionText.colors.chart"
				:segments="SPEEDOMETER_SEGMENTS"
			/>
			<ui-speedometer-description
				:value="props.tension.tension"
				:color="tensionText.colors.text"
				:title="props.viewState.isShowName ? tensionText.text.main : undefined"
				:description="isShowDescription ? tensionText.text.sub : undefined"
				:class="{ [classes.margin]: isShowChart }"
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

.margin {
	margin-top: -80px;
}
</style>
