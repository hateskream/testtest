<script setup lang="ts">
import { useTemplateRef } from 'vue';

import { type DateYYYYMMDD, type IEventBoardResponse } from '@/modules/calendar';

import CalendarEventBoardTv from './event-board/calendar-event-board-tv.vue';
import CalendarEventBoardDashboard from '@/modules/calendar/ui/event-board/calendar-event-board-dashboard.vue';

interface ICalendarEventBoardProps {
	eventBoard: IEventBoardResponse[];
	eventBoardFavorites: string[];
	displayVariant?: 'new' | 'default';
	maxCountRowTable?: number;
}

const props = withDefaults(defineProps<ICalendarEventBoardProps>(), {
	displayVariant: 'default',
	maxCountRowTable: Infinity,
});

const emits = defineEmits<{
	toggleEventBoard: [id: string];
}>();

const scroller = useTemplateRef<typeof CalendarEventBoardDashboard>('scroller');

function scrollToDate(
	date: DateYYYYMMDD,
	param: ScrollIntoViewOptions = {},
) {
	if (!scroller.value) {
		return;
	}

	scroller.value.scrollToDate(date, param);
}

function scrollBy(px: number) {
	if (!scroller.value) {
		return;
	}

	scroller.value.scrollBy(px);
}

function calcMaxCountRowVisible(height: number) {
	if (!scroller.value) {
		return;
	}

	return scroller.value.calcMaxCountRowVisible(height);
}

function snapHeightToNearestStep(height: number) {
	if (!scroller.value) {
		return;
	}

	return scroller.value.snapHeightToNearestStep(height);
}

defineExpose({ scrollToDate, scrollBy, calcMaxCountRowVisible, snapHeightToNearestStep });
</script>

<template>
	<calendar-event-board-tv
		v-if="displayVariant === 'default'"
		v-bind="props"
		ref="scroller"
		@toggle-event-board="emits('toggleEventBoard', $event)"
	/>
	<calendar-event-board-dashboard
		v-else
		ref="scroller"
		v-bind="{
			...props,
			maxCountRowTable
		}"
	/>
</template>
