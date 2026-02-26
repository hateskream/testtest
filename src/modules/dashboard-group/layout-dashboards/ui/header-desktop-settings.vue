<script setup lang="ts">
import { UiModalContent, UiModalTitle, UiModalWrapper } from '@/shared/ui/modal';
import { UiModalItem } from '@/shared/ui/modal-items';
import { UiTagSoon } from '@/shared/ui/tag-soon';

const emit = defineEmits<{
	share: [];
	customize: [];
	undo: [];
	delete: [];
}>();

</script>

<template>
	<ui-modal-wrapper display-variant="new" :class="classes.widgetContextMenu">
		<ui-modal-title>Dashboard settings</ui-modal-title>
		<ui-modal-content>
			<ui-modal-item :class="classes.item">
				<span>Currency</span>
				<ui-tag-soon />
			</ui-modal-item>
			<ui-modal-item :class="classes.item" @click="emit('share')">
				<span>Share</span>
				<ui-tag-soon />
			</ui-modal-item>
			<ui-modal-item :class="classes.item" @click="emit('customize')">
				<span>Customize</span>
				<ui-tag-soon />
			</ui-modal-item>
			<ui-modal-item :class="classes.item" @click="emit('undo')">
				<span>Undo</span>
				<ui-tag-soon />
			</ui-modal-item>
			<ui-modal-item :class="classes.item" @click="emit('delete')">
				<span>Delete</span>
				<ui-tag-soon />
			</ui-modal-item>
		</ui-modal-content>
	</ui-modal-wrapper>
</template>

<style module="classes">
.widgetContextMenu {
	width: 230px;
}

.item {
	justify-content: space-between;
}
</style>
