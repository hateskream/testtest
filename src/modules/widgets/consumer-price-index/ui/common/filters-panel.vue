<script setup lang="ts">
import { ModalBadgeDropdown, ModalBadgeList, ModalItemSelector, WidgetFiltersScrollable } from '@/modules/widgets/base';
import { CpiMetric, CpiRange, metricFilterValueToDisplay, rangeFilterValueToDisplay } from '../../model';

const emit = defineEmits<{
	reset: [];
}>();

interface IFiltersPanelProps {
	isShowRange?: boolean;
	displayVariant: 'default' | 'new';
}

const props = defineProps<IFiltersPanelProps>();

const activeRange = defineModel<CpiRange>('range', { required: true });
const activeMetric = defineModel<CpiMetric>('metric', { required: true });
</script>

<template>
	<widget-filters-scrollable
		:display-variant="props.displayVariant"
		@on-clear-click="emit('reset')"
	>
		<modal-badge-dropdown :display-variant="props.displayVariant">
			<template #title>
				{{ metricFilterValueToDisplay[activeMetric] }}
			</template>
			<template #content>
				<modal-badge-list :display-variant>
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
				<modal-badge-list :display-variant>
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
	</widget-filters-scrollable>
</template>
