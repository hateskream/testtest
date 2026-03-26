<script setup lang="ts">
import { useTickerContext } from '@/modules/ticker/composables';
import { TickerTradingVolumeWidget } from '@/modules/widgets/trading-volume';

const { tickerId } = useTickerContext();
</script>

<template>
	<div :class="classes.section">
		<ticker-trading-volume-widget :meta="{ tickerId, name: 'Trading Volume' }" />
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
</style>
