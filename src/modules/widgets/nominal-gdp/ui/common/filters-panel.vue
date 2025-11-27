<script setup lang="ts">
import { ModalBadgeDropdown, ModalBadgeList, ModalItemSelector } from '@/modules/widgets/base';
import { NominalGdpRange, rangeFilterValueToDisplay } from '../../model';

interface IFiltersPanelProps {
	displayVariant: 'default' | 'new';
}

const props = defineProps<IFiltersPanelProps>();

const activeRange = defineModel<NominalGdpRange>('range', { required: true });
</script>

<template>
	<div :class="classes.container">
		<modal-badge-dropdown :display-variant="props.displayVariant">
			<template #title>
				{{ rangeFilterValueToDisplay[activeRange].selected }}
			</template>
			<template #content>
				<modal-badge-list>
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
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	align-items: center;
	gap: 6px;
}
</style>
