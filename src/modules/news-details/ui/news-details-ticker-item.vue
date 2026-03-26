<script setup lang="ts">
import { useGoToTickerPage } from '@/modules/chart';
import { TickerIcon } from '@/shared/ui/ticker';
import { UiTag } from '@/shared/ui/tag';
import { UiText } from '@/shared/ui/text';
import type { INewsTicker } from '@/modules/news/api/get-news-data';

interface INewsDetailsTickerItemProps {
	ticker: INewsTicker;
}

const props = defineProps<INewsDetailsTickerItemProps>();

const { goToTickerPageLink } = useGoToTickerPage();
</script>

<template>
	<router-link
		:to="goToTickerPageLink(props.ticker.canonical_ticker_id)"
		data-icon-glow-trigger
	>
		<ui-tag icon-position="start">
			<div :class="classes.text">
				<ui-text token="text-200-r" :class="classes.tickerSymbol">
					{{ props.ticker.symbol }}
				</ui-text>
				<ui-text
					v-if="props.ticker.price.change"
					token="text-200-r"
					:class="[classes.tickerChange, classes[props.ticker.price.status]]"
				>
					{{ props.ticker.price.change }}
				</ui-text>
			</div>

			<template #icon>
				<ticker-icon
					:ticker="props.ticker.symbol"
					:src="props.ticker.logo"
					:size="21"
				/>
			</template>
		</ui-tag>
	</router-link>
</template>

<style module="classes">
.text {
	display: contents;
}

.tickerSymbol {
	color: var(--color-text-base-500, #ffffff);
}

.tickerChange {
	padding-left: 3px;
}

.positive {
	color: var(--atom-success-00, #04eda0);
}

.negative {
	color: var(--atom-warning-00, #fc1d4d);
}

.neutral {
	color: var(--text-color-base-300, #9a9a9d);
}
</style>
