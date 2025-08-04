<script setup lang="ts">
import { computed } from 'vue';

import {
	ModalBadge,
	ModalItemSelector,
	ModalBadgeList,
} from '@/modules/widgets/base';
import type { ISingleSetting } from '../model';
import { IconIds, UiIcon } from '@/shared/ui/icon';

const sizeBy = defineModel<ISingleSetting>('sizeBy', { required: true });

const activeSizeBy = computed(
	() => sizeBy.value.values
		.find(sb => sb.key === sizeBy.value.active)?.displayName || '',
);

function updateSizeBy(newSizeBy: string) {
	sizeBy.value.active = newSizeBy;
}
</script>

<template>
	<modal-badge>
		<template #title>
			{{ activeSizeBy }}

			<ui-icon
				:id="IconIds.DropdownDown"
				width="12"
				height="12"
				class="icon"
			/>
		</template>
		<template #content>
			<modal-badge-list>
				<template #title>Size by</template>
				<template #default>
					<modal-item-selector
						v-for="sb in sizeBy.values"
						:key="sb.key"
						:model-value="sb.key === sizeBy.active"
						@update:model-value="updateSizeBy(sb.key)"
					>
						{{ sb.displayName }}
					</modal-item-selector>
				</template>
			</modal-badge-list>
		</template>
	</modal-badge>
</template>
