<script setup lang="ts">
import { ModalBadgeDropdown, ModalBadgeList, ModalItemSelector } from '@/modules/widgets/base';

interface IFiltersPanelProps {
	displayVariant: 'default' | 'new';
	dataRanges: string[];
	displayValueDataRange: Record<string, string>;
}

const props = defineProps<IFiltersPanelProps>();

const activeDateRange = defineModel<string>('dateRange', { required: true });
</script>

<template>
	<div :class="classes.container">
		<modal-badge-dropdown :display-variant="props.displayVariant">
			<template #title>
				{{ displayValueDataRange[activeDateRange] }}
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
