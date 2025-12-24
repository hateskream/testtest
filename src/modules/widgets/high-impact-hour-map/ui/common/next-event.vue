<script setup lang="ts">
import { computed } from 'vue';

import { UiText } from '@/shared/ui/text';
import { UiFlag } from '@/shared/ui/flag';
import { UiPositionTooltip } from '@/shared/ui/position';
import { getDateFormatter } from '@/shared/lib';
import { DashboardTooltipWrapper } from '@/shared/ui/tooltip';
import type { IEvent } from '../../model';
import { UiClamped } from '@/shared/ui/clamped';

import NextEventTimer from './next-event-timer.vue';

interface INextEventProps {
	event: IEvent;
	timezone: string;
}

const props = defineProps<INextEventProps>();

const dateLabel = computed(() => {
	const date = new Date(props.event.datetime);

	const formatter = getDateFormatter({
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		hourCycle: 'h23',
		timeZone: props.timezone.replace('UTC', ''),
	});

	return formatter.format(date);
});
</script>

<template>
	<div :class="classes.eventContainer">
		<ui-text :class="classes.label" token="text-100-r">next event:</ui-text>
		<div :class="classes.event">
			<div :class="classes.title">
				<ui-flag :size="16" :country="props.event.country">
					<template #error-placeholder>
						<ui-text token="text-50-r">{{ props.event.country.charAt(0) }}</ui-text>
					</template>
				</ui-flag>
				<ui-clamped :rows="1">
					<ui-text token="text-300-r">{{ event.title }}</ui-text>
				</ui-clamped>
			</div>
			<ui-position-tooltip
				:open-delay="50"
				placement="top"
			>
				<template #default>
					<ui-text :class="classes.time" token="text-300-r">
						<next-event-timer v-if="props.event.inHours <= 2" :datetime="event.datetime" />
						<span v-else>in {{ props.event.inHours }} hours</span>
					</ui-text>
				</template>
				<template #content>
					<dashboard-tooltip-wrapper>
						<ui-text token="text-300-r">{{ dateLabel }}</ui-text>
					</dashboard-tooltip-wrapper>
				</template>
			</ui-position-tooltip>
		</div>
	</div>
</template>

<style module="classes">
.eventContainer {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.event {
	display: flex;
	justify-content: space-between;
	gap: var(--padding-padding-s3, 4px);
}

.label {
	color: rgb(255 255 255 / 62%);
}

.title {
	display: flex;
	flex: 1 0 0;
	align-items: center;
	color: rgb(255 255 255 / 96%);
	gap: 6px;
}

.time {
	color: rgb(255 255 255 / 96%);
	text-decoration-line: underline;
	text-decoration-style: dotted;
	text-decoration-skip-ink: auto;
	text-decoration-thickness: auto;
	text-underline-offset: auto;
	text-underline-position: from-font;
	cursor: pointer;
}
</style>
