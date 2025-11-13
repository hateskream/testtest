<script setup lang="ts">
import { isAllSelected, toggleAllSelect, toggleSet } from '@/modules/calendar/utils/toolbar.ts';
import { type IMarketData, MarketIds } from '@/modules/calendar';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ModalBadgeList, ModalItemCheckbox } from '@/modules/widgets/base';

const state = defineModel<Set<MarketIds>>({ required: true });

const props = defineProps<{
	markets: IMarketData[];
}>();

function toggleMarket(id: MarketIds) {
	state.value = toggleSet(state.value, id);
}
</script>

<template>
	<modal-badge-list>
		<template #title>Markets</template>
		<template #default>
			<modal-item-checkbox
				:model-value="isAllSelected(state, Object.values(MarketIds))"
				@click="state = toggleAllSelect(state, Object.values(MarketIds))"
			>
				<div :class="classes.modalItem">
					<div :class="classes.iconWrapper">
						<ui-icon
							:id="IconIds.Globus"
							width="14px"
							height="14px"
						/>
					</div>
					<span>
						Entire World
					</span>
				</div>
			</modal-item-checkbox>
			<modal-item-checkbox
				v-for="market in props.markets"
				:key="market.label"
				:model-value="state.has(market.id)"
				@update:model-value="toggleMarket(market.id)"
			>
				<div :class="classes.modalItem">
					<div :class="classes.iconWrapper">
						<ui-icon
							:id="market.icon"
							width="14px"
							height="14px"
						/>
					</div>
					<span>
						{{market.label}}
					</span>
				</div>
			</modal-item-checkbox>
		</template>
	</modal-badge-list>
</template>

<style module="classes">
.modalItem {
	display: flex;
	align-items: center;
	gap: 6px;
}

.iconWrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 16px;
	height: 16px;
	border-radius: 50%;
	outline: 1px solid rgb(44 44 44 / 100%);
}
</style>
