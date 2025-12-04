<script setup lang="ts">
import { UiModalDivider } from '@/shared/ui/modal';

const props = defineProps<{
	displayVariant?: 'default' | 'new';
}>();
</script>

<template>
	<ui-modal-divider v-bind="props" />
</template>
