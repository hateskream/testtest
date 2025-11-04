<script setup lang="ts">
interface IFloatingTeleportProps {
	to?: string;
	disabled?: boolean;
	defer?: boolean;
}

const props = withDefaults(defineProps<IFloatingTeleportProps>(), {
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

<style scoped>

</style>
