<script setup lang="ts">
import { ModalBadgeDropdown, ModalBadgeList, ModalItemSelector, WidgetFiltersScrollable } from '@/modules/widgets/base';
import { NominalGdpRange, rangeFilterValueToDisplay } from '../../model';

const emit = defineEmits<{
	reset: [];
}>();

interface IFiltersPanelProps {
	displayVariant: 'default' | 'new';
}

const props = defineProps<IFiltersPanelProps>();

const activeRange = defineModel<NominalGdpRange>('range', { required: true });
</script>

<template>
	<widget-filters-scrollable
		:display-variant="props.displayVariant"
		@on-clear-click="emit('reset')"
	>
		<modal-badge-dropdown :display-variant="props.displayVariant">
			<template #title>
				{{ rangeFilterValueToDisplay[activeRange].selected }}
			</template>
			<template #content>
				<modal-badge-list :display-variant>
					<template #title>
						Date range
					</template>
					<template
						v-for="filterKey in NominalGdpRange"
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
