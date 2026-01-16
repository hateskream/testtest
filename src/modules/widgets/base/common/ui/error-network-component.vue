<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiText } from '@/shared/ui/text';

const emits = defineEmits<{
	retry: [];
}>();
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.root">
			<div :class="classes.wideContent">
				<ui-text :class="classes.text" token="text-300-r">
					Couldn't load
				</ui-text>
				<button
					:class="classes.retryButton"
					@click="emits('retry')"
				>
					<ui-icon
						:id="IconIds.Retry"
						:class="classes.icon"
						width="16px"
						height="16px"
					/>
					<ui-text token="text-300-r" :class="classes.textRetry">
						Retry
					</ui-text>
				</button>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	justify-content: center;
	height: 32px;
}

.root {
	display: flex;
	align-items: center;
	width: fit-content;
	gap: 4px;
	padding: 0 4px;
	color: var(--text-color-base-100);
	letter-spacing: 0.104px;
	background: var(--atom-base-90, rgb(73 73 80 / 15%));
	border-radius: var(--radius-radius-s14-32, 12.4px);
}

.wideContent {
	display: flex;
	align-items: center;
	gap: 8px;
}

.text {
	padding: 0 var(--padding-padding-s3, 4px);
	color: var(--text-color-base-300);
}

.retryButton {
	display: flex;
	align-items: center;
	height: var(--height-height-s12, 24px);
	padding: 0 var(--tile-padding-md-in, 10px) 0 var(--tile-padding-md-out, 6px);
	background: var(--bg-100, rgb(73 73 80 / 32%));
	border-radius: var(--radius-radius-s12-24, 9.2px);
	gap: var(--padding-padding-s3, 4px);
	cursor: pointer;
	transition: background-color 0.12s ease-in-out;
}

.textRetry {
	color: var(--text-color-base-300);
	transition: color 0.12s ease-in-out;
}

.retryButton:hover {
	background: rgb(73 73 80 / 42%);
}

.retryButton:hover .textRetry {
	color: var(--text-color-base-300-effect);
}
</style>
