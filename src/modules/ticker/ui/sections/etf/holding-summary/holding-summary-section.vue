<script setup lang="ts">
import type { ISectionItem } from '../../../../models';
import { SectorsDiagramTickerWidget, SectorsTableTickerWidget } from '@/modules/widgets/sectors';
import { useTickerContext } from '@/modules/ticker/composables';

interface ISectionProps {
	section: ISectionItem;
}

defineProps<ISectionProps>();

const { tickerId } = useTickerContext();

</script>

<template>
	<div :class="classes.section">
		<div :class="classes.row">
			<sectors-diagram-ticker-widget :class="classes.widget" :meta="{ tickerId, name: 'Holdings Diagram' }" />
			<sectors-diagram-ticker-widget :class="classes.widget" :meta="{ tickerId, name: 'Holdings Diagram' }" />
		</div>
		<sectors-table-ticker-widget :meta="{ tickerId, name: 'Sectors' }" />
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

.row {
	display: flex;
	align-content: flex-start;
	align-items: flex-start;
	align-self: stretch;
	gap: 6px;
}

.widget {
	height: 370px;
}

@container root (width >= 580px) {
	.widget {
		flex: 1 0 0;
	}
}

@container root (width < 580px) {
	.row {
		flex-direction: column;
	}
}
</style>
