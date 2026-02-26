<script setup lang="ts">
import {
	TvEventBoard,
	TvCalendarToolbar,
	type IEventBoardItem,
	type CalendarCountryIdsType,
	type CalendarCategoryType,
	type CalendarImpactType,
} from '@/modules/calendar';

const props = defineProps<{
	currentTime: Date;
	eventBoard: IEventBoardItem[];
	isFetchingNext?: boolean;
	isFetchingPrev?: boolean;
	favorite?: string[];
}>();

const emits = defineEmits<{
	loadPrev: [];
	loadNext: [];
}>();

const country = defineModel<CalendarCountryIdsType[]>('countries', {
	required: true,
});
const categories = defineModel<CalendarCategoryType[]>('categories', {
	required: true,
});
const impact = defineModel<CalendarImpactType[]>('impact', {
	required: true,
});
const range = defineModel<{ from: number; to: number }>('range', {
	required: true,
});
</script>

<template>
	<div :class="classes.view">
		<tv-calendar-toolbar
			v-model:countries="country"
			v-model:categories="categories"
			v-model:impact="impact"
			v-model:range="range"
		/>

		<tv-event-board
			:event-board="props.eventBoard"
			:current-time="props.currentTime"
			:is-fetching-next="props.isFetchingNext"
			:is-fetching-prev="props.isFetchingPrev"
			:favorite="props.favorite"
			@load-next="emits('loadNext')"
			@load-prev="emits('loadPrev')"
		/>
	</div>
</template>

<style module="classes">
.view {
	display: flex;
	flex-direction: column;
	align-items: center;
	align-self: stretch;
	width: 100%;
	height: 100%;
	padding: 0 8px 10px;
	gap: 8px;
}
</style>
