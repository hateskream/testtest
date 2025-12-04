<script setup lang="ts">
import { ModalBadge, ModalBadgeList, ModalItemSelector } from '@/modules/widgets/base';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { rangeFilterValueToDisplay, RealGdpRange } from '../../model';

interface IFiltersPanelProps {
	displayVariant: 'default' | 'new';
}

const props = defineProps<IFiltersPanelProps>();

const activeRange = defineModel<RealGdpRange>('range', { required: true });
</script>

<template>
	<div :class="classes.container">
		<modal-badge :display-variant="props.displayVariant">
			<template #title>
				{{ rangeFilterValueToDisplay[activeRange].selected }}
				<ui-icon
					:id="IconIds.DropdownDown"
					width="12"
					height="12"
				/>
			</template>
			<template #content>
				<modal-badge-list :display-variant>
					<template #title>
						Date range
					</template>
					<template
						v-for="filterKey in RealGdpRange"
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
		</modal-badge>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	align-items: center;
	gap: 6px;
}
</style>
