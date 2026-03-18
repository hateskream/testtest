<script setup lang="ts">
import { ref } from 'vue';

import type { ISectionItem } from '../../../../models';
import {
	SectorsAnalysisTickerWidget,
	SectorsDiagramTickerWidget,
	SectorsTableTickerWidget,
} from '@/modules/widgets/sectors';
import { useTickerContext } from '@/modules/ticker/composables';
import { isFeatureEnabled } from '@/shared/lib';

interface ISectionProps {
	section: ISectionItem;
}

defineProps<ISectionProps>();

const { tickerId } = useTickerContext();

const sectorsTableWidgetIsEnabled = isFeatureEnabled('TICKER_WIDGET_SECTORS_ENABLED');
const sectorsDiagramWidgetIsEnabled = isFeatureEnabled('TICKER_WIDGET_HOLDINGS_DIAGRAM_ENABLED');
const sectorsAnalysisWidgetIsEnabled = isFeatureEnabled('TICKER_WIDGET_SECTORS_ANALYSIS_ENABLED');

const analysisWidgetIsOverflowing = ref(false);

function onChangeAnalysisOverflow(value: boolean) {
	analysisWidgetIsOverflowing.value = value;
}
</script>

<template>
	<div :class="classes.section">
		<div
			v-if="sectorsDiagramWidgetIsEnabled || sectorsAnalysisWidgetIsEnabled"
			:class="[classes.row, { [classes.vertical]: analysisWidgetIsOverflowing }]"
		>
			<sectors-diagram-ticker-widget
				v-if="sectorsDiagramWidgetIsEnabled"
				:class="classes.widget"
				:meta="{ tickerId, name: 'Holdings Diagram' }"
			/>
			<sectors-analysis-ticker-widget
				v-if="sectorsAnalysisWidgetIsEnabled"
				:class="[classes.widget, ]"
				:meta="{ tickerId, name: 'Allocation Analysis' }"
				@change-overflow="onChangeAnalysisOverflow"
			/>
		</div>
		<sectors-table-ticker-widget v-if="sectorsTableWidgetIsEnabled" :meta="{ tickerId, name: 'Sectors' }" />
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

.row.vertical {
	flex-direction: column;
}

.row.vertical .widget {
	height: max-content;
	min-height: 370px;
}

.row:not(.vertical) .widget {
	height: 370px;
}

@container root (width >= 580px) {
	.row:not(.vertical) .widget {
		flex: 1 0 0;
	}
}

@container root (width < 580px) {
	.row {
		flex-direction: column;
	}
}
</style>
