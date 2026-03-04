<script setup lang="ts">
import { computed } from 'vue';

import { UiPositionTooltip } from '@/shared/ui/position';
import { UiTooltipWrapper } from '@/shared/ui/tooltip';
import { UiText } from '@/shared/ui/text';
import { TickerIcon } from '@/shared/ui/ticker';
import type { INewsTicker } from '../../api';

const props = withDefaults(defineProps<{
	tickers: INewsTicker[];
	max?: number;
	displayVariant?: 'default' | 'new';
}>(), {
	max: 3,
	displayVariant: 'new',
});

const preparedTickers = computed(() => props.tickers.slice(0, props.max));
</script>

<template>
	<div :class="classes.wrapper">
		<div :class="classes.stocks">
			<template
				v-for="ticker in preparedTickers"
				:key="ticker.symbol"
			>
				<ui-position-tooltip>
					<div :class="classes.stock">
						<ticker-icon
							:src="ticker.currency_icon"
							:ticker="ticker.symbol"
							:size="16"
						/>
					</div>

					<template #content>
						<ui-tooltip-wrapper :display-variant="props.displayVariant">
							{{ ticker.name }}
						</ui-tooltip-wrapper>
					</template>
				</ui-position-tooltip>
			</template>
		</div>
		<ui-text
			v-if="props.tickers.length > props.max"
			token="text-200-r"
			:class="classes.more"
		>
			+{{ props.tickers.length - props.max }}
		</ui-text>
	</div>
</template>

<style module="classes">
.wrapper {
	display: flex;
	align-items: center;
}

.stocks {
	display: flex;
}

.stock {
	position: relative;
	flex-shrink: 0;
	width: 16px;
	height: 16px;
	overflow: hidden;
	border-radius: 16px;
	cursor: pointer;
}

.stocks > div + div .stock {
	margin-left: -6px;
}

.stocks > div:not(:last-child) .stock {
	mask-image: radial-gradient(circle 12px at calc(100% + 4px) 50%, transparent 100%, #000000 100%);
	mask-size: 100% 100%;
}

.more {
	margin-left: 4px;
	line-height: 1;
	color: var(--text-500, rgb(255 255 255 / 96%));
}
</style>
