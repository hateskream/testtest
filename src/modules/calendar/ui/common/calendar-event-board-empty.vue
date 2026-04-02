<script setup lang="ts">
import { UiEmptyState } from '@/shared/ui/empty-state';
import { UiControlButton } from '@/shared/ui/control-button';

const emits = defineEmits<{
	reset: [];
}>();
</script>

<template>
	<div :class="classes.content">
		<ui-empty-state text-token="text-300-r">
			<template #footer>
				<ui-control-button token="m-24-bg" @click="emits('reset')">
					Reset filters
				</ui-control-button>
			</template>
		</ui-empty-state>
	</div>
</template>

<style module="classes">
.content {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	padding: 4px 0;
}
</style>
