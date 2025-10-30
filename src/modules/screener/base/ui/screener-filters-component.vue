<script setup lang="ts">
import { UiPosition } from '@/shared/ui/position';
import { UiDelimiter } from '@/shared/ui/delimiter';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ModalFilter } from '@/modules/widgets/base';
import { type FiltersDefinition, type FiltersState, type IFilterState, ScreenerType } from '../model';
import { FilterBadgeModal } from './filter';

const filters = defineModel<FiltersState>('filters', { required: true });
const markets = defineModel<string[]>('markets', { required: true });

interface IScreenerFiltersProps {
	type: ScreenerType;
	definitions: FiltersDefinition;
}

const props = defineProps<IScreenerFiltersProps>();

function updateFilter(key: string, state: IFilterState) {
	filters.value = {
		...filters.value,
		[key]: state,
	};
}
</script>
<template>
	<div :class="classes.container">
		<div>
			[MarketSelector]: {{markets}}
		</div>
		<ui-delimiter />
		<ui-position>
			<template #title>
				<ui-icon
					:id="IconIds.NewsFilter"
					width="20"
					height="20"
					:class="classes.icon"
				/>
			</template>
			<template #content>
				<modal-filter>
					<template #content>
						Test
					</template>
				</modal-filter>
			</template>
		</ui-position>
		<filter-badge-modal
			v-for="(filter, key) in props.definitions"
			:key="key"
			:filter="filter"
			:state="filters[key]"
			@update="updateFilter(key, $event)"
		/>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 6px;
	margin-bottom: 8px;
}

.icon {
	margin: 0 6px;
	color: var(--icon-color-base-300);
	cursor: pointer;
}
</style>
