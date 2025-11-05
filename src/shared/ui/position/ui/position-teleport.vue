<script setup lang="ts">
import type { IPositionTeleportProps } from '../model';

const props = withDefaults(defineProps<IPositionTeleportProps>(), {
	to: '#floating-host',
	disabled: false,
	defer: false,
});
</script>

<template>
	<teleport
		:to="props.to"
		:disabled="props.disabled"
		:defer="props.defer"
	>
		<slot />
	</teleport>
</template>
