<script setup lang="ts">
import { ref, watch } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';

const emits = defineEmits<{
	retry: [];
}>();

const isWideScreen = ref(window.innerWidth > 400);

watch(
	() => window.innerWidth,
	newWidth => {
		isWideScreen.value = newWidth > 400;
	},
);
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.root">
			<div
				v-if="isWideScreen"
				:class="classes.wideContent"
			>
				<span :class="classes.text">Couldn't load</span>
				<span
					:class="classes.retryContainer"
					@click="emits('retry')"
				>
					<ui-icon
						:id="IconIds.Retry"
						:class="classes.icon"
						width="20px"
						height="20px"
					/>
					<span :class="classes.textRetry"> Retry </span>
				</span>

				<button
					:class="classes.retryButton"
					@click="emits('retry')"
				>
					R
				</button>
			</div>

			<div
				v-else
				:class="classes.narrowContent"
				@click="emits('retry')"
			>
				<span :class="classes.retryContainer">
					<ui-icon
						:id="IconIds.Retry"
						:class="classes.icon"
						width="20px"
						height="20px"
					/>
					<span :class="classes.textRetry"> Retry </span>
				</span>
				<button :class="classes.retryButton">R</button>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	justify-content: center;
	padding: 6px 0;
}

.root {
	display: flex;
	align-items: center;
	width: fit-content;
	padding: 8px 16px;
	color: var(--text-color-base-100);
	letter-spacing: 0.104px;
	background-color: var(--bg-color-base-100);
	border-radius: 28px;
}

.wideContent {
	display: flex;
	align-items: center;
	gap: 8px;
}

.text {
	font-weight: 400;
	font-size: 14px;
	line-height: 150%;
}

.retryContainer {
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
}

.icon {
	/* color: var(--icon-color-base-300); */
}

.textRetry {
	font-weight: 400;
	font-size: 14px;
	line-height: 150%;
	color: var(--text-color-base-300);
}

.retryButton {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 24px;
	height: 24px;
	font-weight: 500;
	font-size: 14px;
	color: var(--text-color-base-100);
	background-color: var(--bg-color-base-300);
	border-radius: 6px;
	cursor: pointer;
}

.narrowContent {
	display: flex;
	align-items: center;
	gap: 8px;
}
</style>
