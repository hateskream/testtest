<script setup lang="ts">
import CalendarEventCard from './calendar-event-card.vue';
// interface ICalendarEventBoardProps {
// 	data: string;
// }

// const props = defineProps<ICalendarEventBoardProps>();

</script>

<template>
	<div :class="classes.calendarEventBoard">
		<div :class="classes.boardDate">
			Thu 11
		</div>

		<div :class="classes.dayBoard">
			<!-- TODO: v-for events -->
			<calendar-event-card
				event-title="TSLA Earnings Report"
				event-type="Splits"
				:metrics="[
					{ label: 'Ratio', value: '1:6.66' },
				]"
			/>

			<calendar-event-card
				event-title="APPL Earnings Report"
				event-type="Ipo’s"
				:metrics="[
					{ label: 'IPO Value', value: '172.45 B' },
					{ label: 'IPO Price', value: '5.91' },
					{ label: 'Last Price', value: '5.95' },
				]"
			/>

			<calendar-event-card
				event-title="RAI"
				event-title-description="Unlock"
				event-type="Crypto"
				:metrics="[
					{ label: 'Amount', value: '$0.21' },
					{ label: 'Ex-date', value: 'Sep 10, 2025' },
					{ label: 'Pay date', value: 'Sep 21, 2025' },
					{ label: 'Div. yield', value: '3.57%' },
				]"
			/>
		</div>
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
	gap: 4px;
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
