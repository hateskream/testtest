<script setup lang="ts">
import { computed } from 'vue';

import { type AnalystRatings, AnalystRatingsSummary } from '../../../model';
import { BaseTickerWidgetContent, BaseTickerWidgetHeader, BaseTickerWidgetWrapper } from '@/modules/widgets/base';
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
	<base-ticker-widget-wrapper>
		<base-ticker-widget-header>
			<template #default>

				{{props.meta.name}}
			</template>
			<template #right>
				<ui-tag :color="tagColor" :class="classes.tag">{{data.summary}}</ui-tag>
			</template>

		</base-ticker-widget-header>
		<base-ticker-widget-content>


			<div :class="classes.bodyWrapper">
				<div :class="classes.radarWrapper">
					<radar-chart :data="props.data" />
				</div>
			</div>

		</base-ticker-widget-content>
	</base-ticker-widget-wrapper>
</template>

<style module="classes">
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
	padding: 65px 10px 48px;
}
</style>
