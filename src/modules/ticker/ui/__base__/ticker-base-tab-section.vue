<script setup lang="ts">
import { UiText } from '@/shared/ui/text';
import { UiClamped } from '@/shared/ui/clamped';
</script>

<template>
	<div :class="classes.section">
		<div :class="classes.head">
			<ui-clamped :rows="1">
				<ui-text token="title-100" :class="classes.text">
					<slot name="title" />
				</ui-text>
			</ui-clamped>

			<slot name="tags" />
		</div>
		<div :class="classes.body">
			<slot name="content"></slot>
		</div>
	</div>
</template>

<style module="classes">
.section {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-self: stretch;
}

.head {
	display: flex;
	flex-wrap: wrap;
	align-content: center;
	align-items: center;
	align-self: stretch;
	padding: var(--padding-padding-s5, 8px) var(--padding-padding-s11, 20px);
	gap: 4px var(--padding-padding-s3, 4px);
}

.body {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-self: stretch;
	padding: var(--padding-padding-s5, 8px) var(--padding-padding-s11, 20px);
	gap: var(--padding-padding-s5, 8px);
}

.text {
	display: flex;
	align-items: center;
}
</style>
