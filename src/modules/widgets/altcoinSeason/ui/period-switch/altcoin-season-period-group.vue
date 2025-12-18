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
</style>
