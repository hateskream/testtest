<script setup lang="ts">
import { UiIcon, IconIds } from '@/shared/ui/icon';
</script>

<template>
	<div :class="classes.heading">
		<div :class="classes.headingTitle">
			BTC performance rank
		</div>
		<div :class="classes.headingTimeFrame">
			90D
			<ui-icon
				:id="IconIds.DropdownDown"
				:width="12"
				:height="12"
			/>
		</div>
	</div>
</template>

<style module="classes">
.btcPerformanceRankHeading {
	display: flex;
}

.heading {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	align-self: stretch;
}
</style>
