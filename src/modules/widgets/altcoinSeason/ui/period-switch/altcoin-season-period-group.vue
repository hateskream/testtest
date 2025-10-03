<script setup lang="ts">
import { ModalBadge, ModalBadgeList, ModalItemSelector } from '@/modules/widgets/base';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { type Period } from '@/modules/widgets/altcoinSeason/model';

const props = defineProps<{
	periodList: Period[];
}>();

const selectedPeriod = defineModel<Period>('period', { required: true });

const handlePeriodClick = (periodItem: Period) => {
	selectedPeriod.value = periodItem;
};
</script>

<template>
	<div :class="classes.altcoinSeasonPeriodGroup">
		<modal-badge>
			<template #title>
				{{selectedPeriod}}
				<ui-icon
					:id="IconIds.Arrow"
					width="10px"
					height="10px"
					:class="classes.arrow"
				/>
			</template>
			<template #content>
				<modal-badge-list>
					<template #title>
						Period
					</template>

					<modal-item-selector
						v-for="period in props.periodList"
						:key="period"
						:model-value="selectedPeriod === period"
						@click="handlePeriodClick(period)"
					>
						{{period}}
					</modal-item-selector>
				</modal-badge-list>
			</template>
		</modal-badge>
	</div>
</template>

<style module="classes">
.altcoinSeasonPeriodGroup {
	display: flex;
	align-items: center;
	padding: 0 16px;
}

.periodItem {
	display: flex;
	flex: 1 0 0;
	justify-content: center;
	align-items: center;
	height: 28px;
	padding: 6px 8px;
	border-radius: 16px;
	gap: 6px;
	cursor: pointer;

	&.active {
		background: var(--color-bg-actived-base-300-actived, rgb(51 51 51 / 80%));
	}
}

.arrow {
	rotate: -90deg;
}

.periodItemText {
	font-weight: 380;
	font-size: var(--typography-headers-size-h-02, 10px);
	color: var(--color-text-base-300, #9a9a9d);
	letter-spacing: 0.04px;
}
</style>
