<script setup lang="ts">
import { isAllSelected, toggleAllSelect, toggleSet } from '@/modules/calendar/utils/toolbar.ts';
import { EventType } from '@/modules/calendar';
import { ModalBadgeList, ModalItemCheckbox } from '@/modules/widgets/base';

const state = defineModel<Set<EventType>>({ required: true });

const props = defineProps<{
	eventTypes: EventType[];
}>();

function toggleEventType(id: EventType) {
	state.value = toggleSet(state.value, id);
}
</script>

<template>
	<modal-badge-list>
		<template #title>
			Event Type
		</template>

		<template #default>
			<modal-item-checkbox
				:model-value="isAllSelected(state, Object.values(EventType))"
				@click="state = toggleAllSelect(state, Object.values(EventType))"
			>
				All
			</modal-item-checkbox>

			<modal-item-checkbox
				v-for="(event, index) in props.eventTypes"
				:key="index"
				:model-value="state.has(event)"
				@click="toggleEventType(event)"
			>
				{{event}}
			</modal-item-checkbox>
		</template>
	</modal-badge-list>
</template>

<style scoped>

</style>
