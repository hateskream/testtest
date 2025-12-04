<script setup lang="ts">
import { computed } from 'vue';

import ModalFilterRowItem from './modal-filter-row-item.vue';

interface IProps {
	isSelected: boolean;
	ticker?: string | null;
	name?: string | null;
}

const props = defineProps<IProps>();

interface IEmits {
	(e: 'update', state: boolean): void;
}

const emit = defineEmits<IEmits>();

const isSelectedModel = computed({
	get: () => props.isSelected,
	set: () => emit('update', !props.isSelected),
});
</script>

<template>
	<modal-filter-row-item v-model="isSelectedModel">
		<template #image>
			<slot name="image" />
		</template>
		<template #name>{{ props.ticker }}</template>
		<template v-if="props.name" #label>{{ props.name }}</template>
	</modal-filter-row-item>
</template>
