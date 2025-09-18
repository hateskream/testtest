<script setup lang="ts">
import type { IEventBoard } from '@/modules/calendar';

import CalendarEventCard from './calendar-event-card.vue';

interface ICalendarEventBoardProps {
	eventBoard: IEventBoard[];
}

const props = defineProps<ICalendarEventBoardProps>();
</script>

<template>
	<div :class="classes.calendarEventBoard">
		<template v-for="day in props.eventBoard" :key="day.date">
			<div v-if="day.events.length" :class="classes.eventSection">
				<div :class="classes.boardDate">
					{{ day.date }}
				</div>

				<div :class="classes.dayBoard">
					<calendar-event-card
						v-for="(ev, i) in day.events"
						:key="`${day.date}-${i}`"
						:event-title="ev.eventTitle"
						:event-title-description="ev.eventTitleDescription"
						:event-type="ev.eventType as unknown as string"
						:event-datetime="ev.eventDatetime"
						:event-summary="ev.eventSummary"
						:metrics="ev.metrics"
						:ticker="ev.ticker"
						:text="ev.text"
						:link="ev.link"
						:link-text="ev.linkText"
					/>
				</div>
			</div>
		</template>
	</div>
</template>

<style module="classes">
.calendarEventBoard {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	align-self: stretch;
	padding: 16px;
	background: var(--color-bg-surface-01, #0c0c0d);
	border-radius: 18px;
	gap: 12px;
}

.boardDate {
	margin-top: 16px;
	margin-bottom: 8px;
	margin-left: 16px;
	font-weight: 390;
	font-size: var(--typography-headers-size-h00, 15px);
	color: #ffffff;
	letter-spacing: 0.075px;
	text-overflow: ellipsis;
	text-shadow: 0 4px 4px rgb(0 0 0 / 25%);
}

.dayBoard {
	display: flex;
	flex-direction: column;
	gap: 4px;
}
</style>
