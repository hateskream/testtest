<script setup lang="ts">
import BaseSwitchComponent from '../../common/ui/base-switch-component.vue';
import ModalItemComponent from './modal-item-component.vue';

const model = defineModel<boolean>({
	required: true,
});
</script>

<template>
	<modal-item-component
		:class="classes.content"
		@click="model = !model"
	>
		<slot name="default" />

		<base-switch-component :is-active="model" />
	</modal-item-component>
</template>

<style module="classes">
.content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
}
</style>
