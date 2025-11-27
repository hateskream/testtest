<script setup lang="ts">
import { ModalBadgeDropdown, ModalBadgeList, ModalItemSelector } from '@/modules/widgets/base';
import { CpiMetric, CpiRange, metricFilterValueToDisplay, rangeFilterValueToDisplay } from '../../model';

interface IFiltersPanelProps {
	isShowRange?: boolean;
	displayVariant: 'default' | 'new';
}

const props = defineProps<IFiltersPanelProps>();

const activeRange = defineModel<CpiRange>('range', { required: true });
const activeMetric = defineModel<CpiMetric>('metric', { required: true });
</script>

<template>
	<div :class="classes.container">
		<modal-badge-dropdown :display-variant="props.displayVariant">
			<template #title>
				{{ metricFilterValueToDisplay[activeMetric] }}
			</template>
			<template #content>
				<modal-badge-list>
					<template #title>
						CPI
					</template>
					<template
						v-for="filterKey in CpiMetric"
						:key="filterKey"
					>
						<modal-item-selector
							:model-value="filterKey === activeMetric"
							@update:model-value="activeMetric = filterKey"
						>
							{{ metricFilterValueToDisplay[filterKey] }}
						</modal-item-selector>
					</template>
				</modal-badge-list>
			</template>
		</modal-badge-dropdown>
		<modal-badge-dropdown v-if="props.isShowRange" :display-variant="props.displayVariant">
			<template #title>
				{{ rangeFilterValueToDisplay[activeRange].selected }}
			</template>
			<template #content>
				<modal-badge-list>
					<template #title>
						Date range
					</template>
					<template
						v-for="filterKey in CpiRange"
						:key="filterKey"
					>
						<modal-item-selector
							:model-value="filterKey === activeRange"
							@update:model-value="activeRange = filterKey"
						>
							{{ rangeFilterValueToDisplay[filterKey].option }}
						</modal-item-selector>
					</template>
				</modal-badge-list>
			</template>
		</modal-badge-dropdown>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	align-items: center;
	gap: 6px;
}
</style>
