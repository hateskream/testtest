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
			{{props.meta.name}}
		</base-ticker-widget-header>
		<base-ticker-widget-content>


			<div :class="classes.bodyWrapper">
				<div :class="classes.labelWrapper">
					<ui-tag :color="tagColor" :class="classes.tag">{{data.summary}}</ui-tag>
				</div>
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

.labelWrapper {
	display: flex;
	justify-content: flex-end;
	padding: var(--padding-padding-s5, 8px) var(--padding-padding-s11, 20px);
}

.radarWrapper {
	display: flex;
	justify-content: center;
	padding: 45px 10px 48px;
}
</style>
