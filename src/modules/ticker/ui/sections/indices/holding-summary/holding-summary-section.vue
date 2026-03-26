<script setup lang="ts">
import type { ISectionItem } from '../../../../models';
import { SectorsTableTickerWidget } from '@/modules/widgets/sectors';
import { useTickerContext } from '@/modules/ticker/composables';
import { TickerCompanyHeadquartersWidget } from '@/modules/widgets/company-headquarters';
import { isFeatureEnabled } from '@/shared/lib';

interface ISectionProps {
	section: ISectionItem;
}

defineProps<ISectionProps>();

const { tickerId } = useTickerContext();

const companyHeadquartersIsEnabled = isFeatureEnabled('TICKER_WIDGET_COMPANY_HEADQUARTERS_ENABLED');
const sectorsTableWidgetIsEnabled = isFeatureEnabled('TICKER_WIDGET_SECTORS_ENABLED');
</script>

<template>
	<div :class="classes.section">
		<sectors-table-ticker-widget
			v-if="sectorsTableWidgetIsEnabled"
			:meta="{ tickerId, name: 'Sectors' }"
		/>
		<ticker-company-headquarters-widget
			v-if="companyHeadquartersIsEnabled"
			:meta="{ tickerId, name: 'Company Headquarters' }"
		/>
	</div>
</template>

<style module="classes">
.section {
	display: flex;
	flex-direction: column;
	gap: var(--padding-s4, 6px);
	align-self: stretch;
	height: 100%;
}
</style>
