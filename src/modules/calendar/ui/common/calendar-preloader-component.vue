<script setup lang="ts">
import { ListSkeleton } from '@/modules/widgets/base';
</script>

<template>
	<div :class="classes.calendarPreloaderWrapper">
		<list-skeleton />
	</div>
</template>

<style module="classes">
.calendarPreloaderWrapper {
	width: 100%;
}
</style>
