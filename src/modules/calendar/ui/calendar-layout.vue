<script setup lang="ts">
</script>

<template>
	<div :class="classes.calendarLayout">
		<div :class="classes.calendarContent">
			<slot name="content" />
		</div>

		<div :class="classes.calendarSidebar">
			<slot name="calendar-sidebar" />
		</div>
	</div>
</template>

<style module="classes">
.calendarLayout {
	display: grid;
	width: 100%;
	grid-template-columns: 1fr 340px;
	gap: 16px;
}

.calendarContent {
	display: flex;
	flex-direction: column;
	align-items: center;
	align-self: stretch;
	gap: 8px;
	overflow: hidden;
}

.calendarSidebar {
	display: flex;
	flex-direction: column;
	align-items: center;
	align-self: stretch;
	overflow: hidden;
	background: var(--color-bg-surface-01, #0c0c0d);
	border-radius: 18px;
	gap: 8px;
}
</style>
