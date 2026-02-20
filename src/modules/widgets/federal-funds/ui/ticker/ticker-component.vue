<script setup lang="ts">
import { computed } from 'vue';

import { BaseTickerWidgetContent, BaseTickerWidgetHeader, BaseTickerWidgetWrapper } from '@/modules/widgets/base';
import type { ITickerWidgetMeta } from '@/modules/ticker';
import type { IFederalFundsDomain } from '../../model';
import { getDateFormatter } from '@/shared/lib';
import { UiText } from '@/shared/ui/text';

interface IWidgetComponentProps {
	meta: ITickerWidgetMeta;
	data: IFederalFundsDomain;
}

const props = defineProps<IWidgetComponentProps>();

const reviewDateLabel = computed(() => {
	const date = new Date(props.data.next_review_date);

	const formatter = getDateFormatter({
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});

	return formatter.format(date);
});
</script>

<template>
	<base-ticker-widget-wrapper>
		<base-ticker-widget-header>
			{{ props.meta.name }}
		</base-ticker-widget-header>
		<base-ticker-widget-content>
			<div :class="classes.container">
				<div :class="classes.title">
					<ui-text token="title-200">{{ props.data.rate }}%</ui-text>
				</div>
				<ui-text
					:class="classes.text"
					token="text-200-r"
					as="p"
				>
					Next FOMC review scheduled for {{ reviewDateLabel }}
				</ui-text>
			</div>
		</base-ticker-widget-content>
	</base-ticker-widget-wrapper>
</template>

<style module="classes">
.container {
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding: 12px var(--padding-padding-s11, 20px);
}

.title {
	display: flex;
	align-items: center;
	color: rgb(255 255 255 / 96%);
	gap: 6px;
}

.flag {
	width: 20px;
	height: 20px;
	border-radius: 50%;
	object-fit: cover;
	object-position: 25%;
}

.text {
	color: rgb(255 255 255 / 62%);
}
</style>
