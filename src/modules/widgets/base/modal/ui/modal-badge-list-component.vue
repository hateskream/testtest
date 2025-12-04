<script setup lang="ts">
import { UiModalContent, UiModalTitle, UiModalWrapper } from '@/shared/ui/modal';

defineProps<{
	displayVariant: 'default' | 'new';
}>();
</script>

<template>
	<ui-modal-wrapper :display-variant>
		<ui-modal-title v-if="$slots.title">
			<slot name="title" />
		</ui-modal-title>

		<ui-modal-content>
			<slot />
		</ui-modal-content>
	</ui-modal-wrapper>
</template>

<style module="classes">

</style>
