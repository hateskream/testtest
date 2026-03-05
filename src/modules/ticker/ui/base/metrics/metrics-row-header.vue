<script setup lang="ts">
import { UiText } from '@/shared/ui/text';
</script>

<template>
	<div :class="classes.header">
		<ui-text token="text-50-r-up">
			<slot />
		</ui-text>
	</div>
</template>

<style module="classes">
.header {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	width: 84px;
	height: var(--height-s12, 24px);
	gap: var(--padding-s3, 4px);
}
</style>
