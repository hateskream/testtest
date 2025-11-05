<script setup lang="ts">
import { computed } from 'vue';

import { MarketType } from '@/modules/market';
import { ModalTickerSelectorWithBadge } from '@/modules/ticker-selector';
import { dateRangeFilterValueToDisplay, type IDisplaySettings, MarketCapDateRange } from '../../model';
import { ModalBadge, ModalBadgeList, ModalItemSelector } from '@/modules/widgets/base';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import type { IMeta } from '@/modules/dashboard-group';
import { UiDelimiter } from '@/shared/ui/delimiter';

const selectedTickers = defineModel<string[]>('selectedTickers', { required: true });
const activeDateRange = defineModel<MarketCapDateRange>('dateRange', { required: true });

interface IMarketCapFiltersPanelProps {
	meta: IMeta;
	displaySettings: IDisplaySettings;
	displayVariant?: 'default' | 'new';
}

const props = defineProps<IMarketCapFiltersPanelProps>();

const dateRangeMustBeVisible = computed(() => props.displaySettings.isShowChart && (
	props.meta.size.h > 3
	&& props.meta.size.h < 8
));
</script>

<template>
	<div :class="classes.container">
		<modal-ticker-selector-with-badge
			v-model="selectedTickers"
			:market-types="[MarketType.Crypto, MarketType.Stock]"
			:display-variant="props.displayVariant"
			autofocus
		/>
		<template v-if="dateRangeMustBeVisible">
			<ui-delimiter />
			<modal-badge>
				<template #title>
					{{ dateRangeFilterValueToDisplay[activeDateRange].selected }}
					<ui-icon
						:id="IconIds.DropdownDown"
						width="12"
						height="12"
					/>
				</template>
				<template #content>
					<modal-badge-list>
						<template #title>Date</template>
						<template
							v-for="filterKey in MarketCapDateRange"
							:key="filterKey"
						>
							<modal-item-selector
								:model-value="filterKey === activeDateRange"
								@update:model-value="activeDateRange = filterKey"
							>
								{{ dateRangeFilterValueToDisplay[filterKey].option }}
							</modal-item-selector>
						</template>
					</modal-badge-list>
				</template>
			</modal-badge>
		</template>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	align-items: center;
	gap: 6px;
}
</style>
