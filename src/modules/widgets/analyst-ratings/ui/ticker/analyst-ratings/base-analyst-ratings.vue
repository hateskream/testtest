<script setup lang="ts">
import { computed } from 'vue';

import { type AnalystRatings, AnalystRatingsSummary } from '../../../model';
import { type ITickerWidgetMeta } from '@/modules/ticker';
import { RadarChart } from '../../common';
import { TagColor, UiTag } from '@/shared/ui/tag';

interface IProps {
	data: AnalystRatings;
	meta: ITickerWidgetMeta;
}

const props = defineProps<IProps>();

const tagColor = computed(()=>{
	switch (props.data.summary) {
		case AnalystRatingsSummary.Optimistic: return TagColor.Positive;
		case AnalystRatingsSummary.Pessimistic: return TagColor.Negative;
		default : return TagColor.Neutral;
	}
});
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.header">
			<ui-tag :color="tagColor" :class="classes.tag">{{ data.summary }}</ui-tag>
		</div>
		<div :class="classes.bodyWrapper">
			<div :class="classes.radarWrapper">
				<radar-chart :data="props.data" />
			</div>
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-direction: column;
}

.header {
	display: flex;
	justify-content: flex-end;
	padding: var(--padding-s5, 8px) var(--padding-s11, 20px);
}

.bodyWrapper {
	display: flex;
	flex-direction: column;
	width: 100%;
}

.tag {
	text-transform: capitalize;
}

.radarWrapper {
	display: flex;
	justify-content: center;
	padding: 34px 10px 38px;
}
</style>
