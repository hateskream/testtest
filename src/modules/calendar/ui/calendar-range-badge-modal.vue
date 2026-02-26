<script setup lang="ts">
import { ModalBadge, ModalSubmenuContent } from '@/modules/widgets/base';
import { UiIcon, IconIds } from '@/shared/ui/icon';

import CalendarRangePicker from './common/calendar-range-picker.vue';

const model = defineModel<{ from: number; to: number }>({
	required: true,
});
</script>

<template>
	<modal-badge
		class="date-modal"
		strategy="absolute"
	>
		<template #title="{ isVisible }">
			<ui-icon
				:id="IconIds.CalendarV2"
				width="20px"
				height="20px"
				:class="['dropdown-icon', { 'rotated': isVisible }]"
			/>
		</template>
		<template #content>
			<modal-submenu-content>
				<template #content>
					<calendar-range-picker v-model="model" />
				</template>
			</modal-submenu-content>
		</template>
	</modal-badge>
</template>

<style module="classes">
</style>
