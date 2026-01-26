<script setup lang="ts">
import { TvEventBoard, type IEventBoardItem } from '@/modules/calendar-new';

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
</script>

<template>
	<div :class="classes.view">
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
	height: 100%;
	width: 100%;
	padding: 0 8px 10px;
	gap: 8px;
}
</style>
