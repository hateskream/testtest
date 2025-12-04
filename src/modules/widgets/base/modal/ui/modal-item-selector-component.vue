<script setup lang="ts">
import { UiModalItemSelector } from '@/shared/ui/modal-items';

const model = defineModel<boolean>({
	required: true,
});
</script>

<template>
	<ui-modal-item-selector v-model="model">
		<slot />
	</ui-modal-item-selector>
</template>
