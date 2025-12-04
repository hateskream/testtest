<script setup lang="ts">
import ModalItemComponent from './modal-item-component.vue';


interface IProps {
	value: string | number;
}

defineProps<IProps>();
</script>

<template>
	<modal-item-component :class="classes.content">
		<slot name="default" />

		<span :class="classes.number">{{ value }}</span>
	</modal-item-component>
</template>

<style module="classes">
.content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
}

.number {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 24px;
	height: 24px;
	font-weight: 300;
	font-size: 12px;
	color: var(--text-color-base-300);
	border: 1px solid var(--border-color-surface-02);
	border-radius: 9px;
}
</style>
