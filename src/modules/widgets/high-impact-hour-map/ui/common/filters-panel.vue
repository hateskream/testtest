<script setup lang="ts">
import { useTemplateRef } from 'vue';

import { ModalBadgeDropdown, ModalBadgeList, ModalItemSelector, WidgetFiltersScrollable } from '@/modules/widgets/base';

const emit = defineEmits<{
	reset: [];
}>();

interface IFiltersPanelProps {
	displayVariant: 'default' | 'new';
	dataRanges: string[];
	displayValueDataRange: Record<string, string>;
}

const props = defineProps<IFiltersPanelProps>();

const activeDateRange = defineModel<string>('dateRange', { required: true });

const dropdownRef = useTemplateRef('dropdown');

function closeDropdown() {
	dropdownRef.value?.close?.();
}

function select(range: string) {
	activeDateRange.value = range;
	closeDropdown();
}
</script>

<template>
	<widget-filters-scrollable
		:display-variant="props.displayVariant"
		@on-clear-click="emit('reset')"
	>
		<modal-badge-dropdown ref="dropdown" :display-variant="props.displayVariant">
			<template #title>
				{{ displayValueDataRange[activeDateRange] }}
			</template>
			<template #content>
				<modal-badge-list :display-variant>
					<template #title>
						Time zone
					</template>
					<template
						v-for="filterKey in props.dataRanges"
						:key="filterKey"
					>
						<modal-item-selector
							:model-value="filterKey === activeDateRange"
							@update:model-value="select(filterKey)"
						>
							{{ displayValueDataRange[filterKey] }}
						</modal-item-selector>
					</template>
				</modal-badge-list>
			</template>
		</modal-badge-dropdown>
	</widget-filters-scrollable>
</template>
