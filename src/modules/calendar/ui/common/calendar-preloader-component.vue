<script setup lang="ts">
import EventBoardCardLoader from './event-board-card-loader.vue';
</script>

<template>
	<div :class="classes.calendarPreloaderWrapper">
		<event-board-card-loader v-for="num in 12" :key="num" />
	</div>
</template>

<style module="classes">
.calendarPreloaderWrapper {
	flex: 1 0 0;
	width: 100%;
	overflow: hidden;
}
</style>
