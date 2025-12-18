<script setup lang="ts">
import { UiFilterChip } from '@/shared/ui/modal-filter';

interface ITabWrapperProps {
	isActive?: boolean;
	isEditing?: boolean;
}

const props = defineProps<ITabWrapperProps>();
</script>

<template>
	<ui-filter-chip v-bind="props">
		<slot />
	</ui-filter-chip>
</template>

<style module="classes">

</style>
