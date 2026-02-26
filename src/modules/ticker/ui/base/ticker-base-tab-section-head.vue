<script setup lang="ts">
import { UiText } from '@/shared/ui/text';
import { UiClamped } from '@/shared/ui/clamped';
</script>

<template>
	<div :class="classes.head">
		<ui-clamped :rows="1">
			<ui-text token="title-100" :class="classes.text">
				<slot />
			</ui-text>
		</ui-clamped>

		<slot name="tags" />
	</div>
</template>

<style module="classes">
.head {
	display: flex;
	flex-wrap: wrap;
	align-content: center;
	align-items: center;
	align-self: stretch;
	padding: var(--padding-padding-s5, 8px) var(--padding-padding-s11, 20px);
	gap: 4px var(--padding-padding-s3, 4px);
}

.text {
	display: flex;
	align-items: center;
}
</style>
