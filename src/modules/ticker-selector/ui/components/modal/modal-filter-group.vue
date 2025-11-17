<script setup lang="ts">
import { computed } from 'vue';

import { getMappedMarket, type ITickerSelectAction, SymbolToName, type TickerDto } from '../../../model';
import { SymbolType } from '@/modules/cell';
import { UiIcon } from '@/shared/ui/icon';
import type { MarketType } from '@/modules/market';

import ModalFilterRow from './modal-filter-row.vue';
import ModalFilterRowTitle from './modal-filter-row-title.vue';
import ModalFilterEmptyState from './modal-filter-empty-state.vue';
import ModalFilterScrollable from './modal-filter-scrollable.vue';
import ModalFilterRowItem from './modal-filter-row-item.vue';

interface IModalFilterGroupProps {
	tickers: TickerDto[];
	selectedTickerIds: string[];
	enableSelectAll?: boolean;
	enableBack?: boolean;
	isSearching?: boolean;
	selectionMode?: 'single' | 'multiple';
	displayVariant: 'new' | 'default';
	group: SymbolType;
	market: MarketType | null;
	enableMarkets?: boolean;
	isSelectedMarket?: boolean;
}

const props = withDefaults(defineProps<IModalFilterGroupProps>(), {
	selectionMode: 'multiple',
});

interface IEmits {
	(e: 'back'): void;
	(e: 'select-all'): void;
	(e: 'toggle-market'): void;
	(e: 'update', action: ITickerSelectAction): void;
}

const emit = defineEmits<IEmits>();

const groupName = computed(() => SymbolToName[props.group]);

const mappedMarket = computed(() => {
	if (props.market) {
		return getMappedMarket(props.market);
	}

	return null;
});

const isSelectedAll = computed(() => props.selectedTickerIds.length === props.tickers.length);
</script>


<template>
	<modal-filter-scrollable>
		<modal-filter-row-title
			v-if="enableBack"
			:is-selected-all="isSelectedAll"
			:is-searching="props.isSearching"
			:enable-select-all="props.enableSelectAll"
			:class="classes.title"
			is-back
			is-inside-open
			@click="emit('back')"
			@select-all="emit('select-all')"
		>
			<template #title>{{ groupName }}</template>
			<template #count>{{ props.tickers.length }}</template>
		</modal-filter-row-title>
		<modal-filter-empty-state v-if="props.isSearching && props.tickers.length === 0">
			Nothing found in {{ groupName }}
		</modal-filter-empty-state>
		<modal-filter-row
			v-else
			:list="props.tickers"
			:selected-ids-map="props.selectedTickerIds"
			:display-variant="props.displayVariant"
			@update="emit('update', $event)"
		>
			<template v-if="props.enableMarkets && mappedMarket" #before-tickers>
				<modal-filter-row-item
					:uppercase-name="false"
					:model-value="isSelectedMarket"
					:class="classes.market"
					@update:model-value="emit('toggle-market')"
				>
					<template #image>
						<div :class="classes.marketIconWrapper">
							<ui-icon
								:id="mappedMarket.icon"
								width="22px"
								height="22px"
								:class="classes.marketIcon"
							/>
						</div>
					</template>
					<template #name>{{ mappedMarket.label }}</template>
				</modal-filter-row-item>
			</template>
		</modal-filter-row>
	</modal-filter-scrollable>
</template>

<style module="classes">
.title {
	flex-shrink: 0;
}

.market {
	flex-shrink: 0;
}

.marketIconWrapper {
	display: flex;
	flex-shrink: 0;
	justify-content: center;
	align-items: center;
	width: 30px;
	height: 30px;
	text-align: center;
	background: transparent;
	border: 1px solid var(--border-color-base-300);
	border-radius: 999px;
	backdrop-filter: none;
	isolation: isolate;
}

.marketIcon {
	color: var(--icon-color-base-300);
}
</style>
