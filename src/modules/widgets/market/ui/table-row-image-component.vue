<script setup lang="ts">
import { UiImage } from '@/shared/ui/image';

interface IProps {
	src: string;
	value: string;
}

defineProps<IProps>();
</script>

<template>
	<div :class="classes.tableIcon">
		<div :class="classes.imageWrapper">
			<ui-image
				:src="src"
				replacement="/images/market/ADA.png"
			/>
		</div>

		<div>{{ value }}</div>
	</div>
</template>

<style module="classes">
.imageWrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 4px;
	border: 1px solid var(--border-color-base-300);
	border-radius: 100px;
}

.tableIcon {
	display: flex;
	align-items: center;
	gap: 8px;
}
</style>
