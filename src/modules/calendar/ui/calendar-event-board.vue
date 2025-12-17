<script setup lang="ts">
import { type IEventBoardResponse } from '@/modules/calendar';

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
