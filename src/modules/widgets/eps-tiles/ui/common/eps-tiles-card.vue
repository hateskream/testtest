<script setup lang="ts">
import { computed, useCssModule } from 'vue';

import { BaseTickerWidgetWrapper } from '@/modules/widgets/base';
import { UiControlButton } from '@/shared/ui/control-button';
import { UiTag } from '@/shared/ui/tag';
import { UiText } from '@/shared/ui/text';
import { getDateFormatter } from '@/shared/lib/date-formatter';
import { type EpsTilesItem, EpsTilesStatus } from '../../model';
import { IconIds } from '@/shared/ui/icon';

interface IEpsTilesCardProps {
	item: EpsTilesItem;
}

const props = defineProps<IEpsTilesCardProps>();

const isUpcoming = computed(() => props.item.status === EpsTilesStatus.Upcoming);
const isPositive = computed(() => props.item.change !== null && props.item.change > 0);

const epsLabel = computed(() => isUpcoming.value ? 'Est. EPS' : 'Actual EPS');

const epsValue = computed(() => {
	const value = isUpcoming.value ? props.item.eps_estimate : props.item.eps;
	return value !== null ? value.toFixed(2) : '−';
});

const classes = useCssModule('classes');

const isNeutral = computed(() => props.item.change === null || props.item.change === 0);

const tileClass = computed(() => {
	if (isUpcoming.value || isNeutral.value) {
		return classes.upcoming;
	}
	return isPositive.value ? classes.positive : classes.negative;
});

const changeText = computed(() => {
	if (props.item.change === null) {
		return null;
	}
	return `${props.item.change.toFixed(2)}%`;
});

const changeClass = computed(
	() => isPositive.value ? classes.positive : classes.negative,
);

const tagColor = computed(() => {
	if (props.item.status === EpsTilesStatus.Beat) {
		return 'positive';
	}
	if (props.item.status === EpsTilesStatus.Miss) {
		return 'negative';
	}
	return 'neutral';
});

const formattedDate = computed(() => {
	if (!props.item.date) {
		return null;
	}
	const date = new Date(props.item.date);
	const formatter = getDateFormatter({
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	});
	return formatter.format(date);
});

const tagText = computed(() => {
	if (props.item.status === EpsTilesStatus.Beat) {
		return 'Beat';
	}
	if (props.item.status === EpsTilesStatus.Miss) {
		return 'Miss';
	}
	return 'Upcoming';
});
</script>

<template>
	<base-ticker-widget-wrapper :class="classes.card">
		<div :class="classes.header">
			<ui-text token="text-200-r" :class="classes.headerLabel">
				{{ props.item.quarter }}
			</ui-text>
		</div>
		<div :class="classes.body">
			<div :class="classes.rows">
				<div :class="classes.row">
					<div :class="[classes.rowHead, classes.left]">
						<ui-text token="text-200-r" :class="classes.label">{{ epsLabel }}</ui-text>
					</div>
					<div :class="[classes.rowBody, classes.left, tileClass]">
						<ui-text token="title-200" :class="classes.value">
							{{ epsValue }}
						</ui-text>
					</div>
				</div>
				<div :class="classes.row">
					<div :class="[classes.rowHead, classes.right]">
						<ui-text token="text-200-r" :class="classes.label">Revenue</ui-text>
					</div>
					<div :class="[classes.rowBody, classes.right, tileClass]">
						<ui-text token="title-200" :class="classes.value">
							{{ props.item.revenue }}
						</ui-text>
					</div>
				</div>
			</div>
		</div>
		<div :class="classes.footer">
			<template v-if="isUpcoming">
				<ui-text token="title-400" :class="classes.footerText">
					{{ formattedDate }}
				</ui-text>
				<ui-control-button token="m-24-bg" :icon-id="IconIds.Plus">
					Add to Calendar
				</ui-control-button>
			</template>
			<template v-else>
				<ui-text
					v-if="changeText"
					token="title-400"
					:class="[changeClass, classes.change]"
				>
					{{ changeText }}
				</ui-text>
				<ui-tag :color="tagColor">{{ tagText }}</ui-tag>
			</template>
		</div>
	</base-ticker-widget-wrapper>
</template>

<style module="classes">
.card {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
	height: 320px;
	gap: 10px;
}

.header {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 219px;
	height: 40px;
	padding: var(--padding-padding-s4, 6px) var(--padding-padding-s8, 14px);
	gap: var(--padding-padding-s3, 4px);
}

.headerLabel {
	display: flex;
	align-items: center;
	height: var(--height-height-s12, 24px);
	padding: var(--padding-padding-s3, 4px) var(--padding-padding-s4, 6px);
	gap: var(--padding-padding-s3, 4px);
}

.body {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	align-self: stretch;
}

.rows {
	display: flex;
	justify-content: center;
	align-items: flex-start;
	gap: var(--padding-padding-s2, 2px);
}

.row {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: var(--padding-padding-s1, 1px);
}

.rowHead {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 86px;
	padding: var(--padding-padding-s4, 6px) 0 var(--padding-padding-s3, 4px) 0;
	background: var(--atom-base-95, rgb(73 73 80 / 10%));
}

.rowHead.left {
	border-radius: var(--radius-radius-s14-32, 12.4px) 0 0 0;
}

.rowHead.right {
	border-radius: 0 var(--radius-radius-s14-32, 12.4px) 0 0;
}

.rowBody {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 86px;
	padding: var(--padding-padding-s6, 10px) 8px var(--padding-padding-s7, 12px) 8px;
	gap: 10px;
}

.rowBody.left {
	border-radius: 0 0 0 var(--radius-radius-s14-32, 12.4px);
}

.rowBody.right {
	border-radius: 0 0 var(--radius-radius-s14-32, 12.4px) 0;
}

.footer {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	align-self: stretch;
	gap: var(--padding-padding-s9, 16px);
}

.footerText {
	color: var(--text-500, rgb(255 255 255 / 96%));
}

.positive {
	color: var(--success-success-00, #04eda0);
	background: var(--atom-success-90, rgb(4 237 160 / 10%));
}

.negative {
	color: var(--warning-warning-00, #fc1d4d);
	background-color: var(--warning-success-90, rgb(252 29 77 / 10%));
}

.upcoming {
	color: var(--text-300, rgb(255 255 255 / 62%));
	background: var(--bg-100, rgb(73 73 80 / 32%));
}


.change {
	background: none;
}
</style>
