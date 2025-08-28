<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { DisplayVariant } from '../../model';

const displayVariant = defineModel<DisplayVariant>('displayVariant', { required: true });

function updateDisplayVariant(value: DisplayVariant) {
	displayVariant.value = value;
}
</script>

<template>
	<div :class="classes.viewToggle">
		<button
			:class="[classes.toggleButton, { [classes.active]: displayVariant === DisplayVariant.Bar }]"
			title="Bar view"
			@click="updateDisplayVariant(DisplayVariant.Bar)"
		>
			<ui-icon
				:id="IconIds.Bars"
				:class="classes.icon"
				width="20"
				height="20"
			/>
		</button>

		<button
			:class="[classes.toggleButton, { [classes.active]: displayVariant === DisplayVariant.List }]"
			title="List view"
			@click="updateDisplayVariant(DisplayVariant.List)"
		>
			<ui-icon
				:id="IconIds.List"
				:class="classes.icon"
				width="20"
				height="20"
			/>
		</button>
	</div>
</template>

<style module="classes">
.viewToggle {
	display: flex;
	align-items: center;
	padding: 2px;
	background: var(--bg-color-base-300, rgb(37 37 39 / 50%));
	border-radius: var(--radius-01, 8px);
}

.toggleButton {
	display: flex;
	align-items: center;
	height: 30px;
	padding: 0 10px;
	background: var(--white-white-0, rgb(255 255 255 / 0%));
	border-radius: var(--tile-gap, 6px);
	gap: 8px;
}

.toggleButton:hover {
	background: var(--bg-color-surface-03);
}

.toggleButton.active {
	background: var(--bg-color-actived-base-300-actived, rgb(51 51 51 / 80%));
	border-radius: var(--tile-gap, 6px);
	box-shadow: 0 0 6px 0 rgb(0 0 0 / 2%), 0 2px 4px 0 rgb(0 0 0 / 8%);

	.icon {
		color: var(--icon-color-base-500, #ffffff);
	}
}

.icon {
	color: var(--icon-color-base-300, #646568);
}
</style>
