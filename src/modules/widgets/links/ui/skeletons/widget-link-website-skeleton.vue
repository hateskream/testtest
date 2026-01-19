<script setup lang="ts">
import { DashboardPillItem, DashboardPillWrapper } from '@/shared/ui/pill';
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<dashboard-pill-wrapper :class="classes.pills">
		<dashboard-pill-item :class="classes.pillLabel">
			<ui-skeleton height="100%" />
		</dashboard-pill-item>
		<dashboard-pill-item :class="classes.pillIcon">
			<ui-skeleton height="100%" />
		</dashboard-pill-item>
	</dashboard-pill-wrapper>
</template>

<style module="classes">
.pills {
	width: unset;
	padding: 0;
	grid-auto-columns: unset;
}

.pillLabel {
	width: 90px;
	padding: 0;
	overflow: hidden;
}

.pillIcon {
	width: 28px;
	padding: 0;
	overflow: hidden;
}
</style>
