<script setup lang="ts">
import { useTickerContext } from '@/modules/ticker/composables';
import { TickerAnnualReturnsWidget } from '@/modules/widgets/annual-returns';

const { tickerId } = useTickerContext();
</script>

<template>
	<div :class="classes.section">
		<div :class="classes.metrics">
			<ticker-annual-returns-widget :meta="{ tickerId, name: 'Annual Returns' }" />
		</div>
	</div>
</template>

<style module="classes">
.section {
	display: flex;
	flex-direction: column;
	gap: var(--padding-s4, 6px);
	container-type: inline-size;
	container-name: root;
}

.metrics {
	display: flex;
	align-content: flex-start;
	align-items: flex-start;
	align-self: stretch;
	gap: 6px;
}
</style>
