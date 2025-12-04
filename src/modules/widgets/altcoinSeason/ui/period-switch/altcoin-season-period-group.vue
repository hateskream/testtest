<script setup lang="ts">
import { ModalBadgeDropdown, ModalBadgeList, ModalItemSelector } from '@/modules/widgets/base';
import { type Period } from '@/modules/widgets/altcoinSeason/model';

const props = defineProps<{
	periodList: readonly Period[];
}>();

const selectedPeriod = defineModel<Period>('period', { required: true });
</script>

<template>
	<div :class="classes.altcoinSeasonPeriodGroup">
		<modal-badge-dropdown display-variant="default">
			<template #title>
				{{selectedPeriod}}
			</template>
			<template #content>
				<modal-badge-list display-variant="default">
					<template #title>
						Period
					</template>

					<modal-item-selector
						v-for="period in props.periodList"
						:key="period"
						:model-value="selectedPeriod === period"
						@update:model-value="selectedPeriod = period"
					>
						{{period}}
					</modal-item-selector>
				</modal-badge-list>
			</template>
		</modal-badge-dropdown>
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
