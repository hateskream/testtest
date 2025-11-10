<script setup lang="ts">
import {
	type IEventBoardResponse,
} from '@/modules/calendar';

import CalendarEventBoardTv from './event-board/calendar-event-board-tv.vue';
import CalendarEventBoardDashboard from '@/modules/calendar/ui/event-board/calendar-event-board-dashboard.vue';

interface ICalendarEventBoardProps {
	eventBoard: IEventBoardResponse[];
	eventBoardFavorites: string[];
	displayVariant?: 'new' | 'default';
}

const props = withDefaults(defineProps<ICalendarEventBoardProps>(), {
	displayVariant: 'default',
});

const emits = defineEmits<{
	toggleEventBoard: [id: string];
}>();
</script>

<template>
	<calendar-event-board-tv
		v-if="displayVariant === 'default'"
		v-bind="props"
		@toggle-event-board="emits('toggleEventBoard', $event)"
	/>
	<calendar-event-board-dashboard
		v-else
		v-bind="props"
	/>
</template>

<style module="classes">
.calendarEventBoard {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	align-self: stretch;
	overflow-y: scroll;
	background: var(--color-bg-surface-01, #0c0c0d);
	gap: 12px;
	border-radius: 16px;
	scrollbar-width: none;
	-ms-overflow-style: none;
}

.calendarEventBoard::-webkit-scrollbar {
	display: none;
}

.boardDate {
	position: sticky;
	top: 0;
	z-index: 2;
	display: flex;
	align-items: center;
	height: 44px;
	padding-left: 10px;
	font-size: var(--typography-headers-size-h00, 15px);
	line-height: 1.7;
	color: #ffffff;
	letter-spacing: 0.075px;
	text-overflow: ellipsis;
	text-shadow: 0 4px 4px rgb(0 0 0 / 25%);
	background: var(--color-bg-surface-01, #0c0c0d);
}

.lightning::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	z-index: 0;
	width: 40px;
	height: 100%;
	background:
		linear-gradient(
			270deg,
			var(--light-start) 0%,
			var(--light-mid) 100%
		);
	border-left: 2px solid var(--light-border);
}

@media screen and (max-width: 1024px) {
	.calendarEventBoard {
		border-radius: 0;
	}
}

.hourSection {
	position: relative;
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	align-items: flex-start;
	align-self: stretch;
}

.hourLabel {
	position: relative;
	display: flex;
	align-items: end;
	height: 30px;
	padding-bottom: 4px;
	padding-left: 10px;
	font-style: normal;
	font-weight: 440;
	font-size: var(--typography-paragraph-size-p-02, 10px);
	line-height: 170%;
	letter-spacing: 0.08px;
	text-shadow: 0 4px 4px rgb(0 0 0 / 25%);
}

.dayBoard {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 0 6px 6px 8px;
}

.missed {
	cursor: default;
	opacity: 0.4;
}
</style>
