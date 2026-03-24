<script setup lang="ts">
import { useTickerContext } from '@/modules/ticker/composables';
import { TickerAnnualReturnsWidget } from '@/modules/widgets/annual-returns';
import { AnnualMarginTrendsTickerWidget } from '@/modules/widgets/annual-margin-trends';

const { tickerId } = useTickerContext();
</script>

<template>
	<div :class="classes.section">
		<div :class="classes.metrics">
			<ticker-annual-returns-widget
				:class="classes.metricsItem"
				:meta="{ tickerId, name: 'Annual Returns' }"
			/>
			<annual-margin-trends-ticker-widget
				:class="classes.metricsItem"
				:meta="{ tickerId, name: 'Annual Margin Trends' }"
			/>
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

.metricsItem {
	height: 330px;
}

@container root (width >= 580px) {
	.metricsItem {
		flex: 1 0 0;
	}
}

@container root (width < 580px) {
	.metrics {
		flex-direction: column;
	}

	.metricsItem {
		width: 100%;
	}
}
</style>
