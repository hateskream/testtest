<script setup lang="ts">
import { ModalBadge, ModalBadgeList, ModalItemSelector } from '@/modules/widgets/base';
import { IconIds, UiIcon } from '@/shared/ui/icon';
interface IFiltersPanelProps {
	displayVariant?: 'default' | 'new';
	dataRanges: string[];
	displayValueDataRange: Record<string, string>;
}

const props = defineProps<IFiltersPanelProps>();

const activeDateRange = defineModel<string>('dateRange', { required: true });
</script>

<template>
	<div :class="classes.container">
		<modal-badge :display-variant="props.displayVariant">
			<template #title>
				{{ displayValueDataRange[activeDateRange] }}
				<ui-icon
					:id="IconIds.DropdownDown"
					width="12"
					height="12"
				/>
			</template>
			<template #content>
				<modal-badge-list>
					<template #title>
						Time zone
					</template>
					<template
						v-for="filterKey in props.dataRanges"
						:key="filterKey"
					>
						<modal-item-selector
							:model-value="filterKey === activeDateRange"
							@update:model-value="activeDateRange = filterKey"
						>
							{{ displayValueDataRange[filterKey] }}
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
