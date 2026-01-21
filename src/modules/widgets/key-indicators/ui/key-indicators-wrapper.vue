<script setup lang="ts">
import { UiText } from '@/shared/ui/text';
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.indicators">
			<slot name="indicators" />
		</div>

		<ui-text token="text-100-r" :class="classes.summarized">
			<slot name="summarized" />
		</ui-text>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 8px 20px;
	gap: 8px;
}

.indicators {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.summarized {
	color: var(--text-300, rgb(255 255 255 / 62%));
}
</style>
