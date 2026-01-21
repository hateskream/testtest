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
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 8px 20px;
}

.indicators {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.summarized {
	color: var(--text-300, rgba(255, 255, 255, 0.62));
}
</style>
