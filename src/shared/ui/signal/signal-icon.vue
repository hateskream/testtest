<script setup lang="ts">

interface ISignalIconProps {
	active?: 0 | 1 | 2 | 3;
}

const props = withDefaults(defineProps<ISignalIconProps>(), {
	active: 3,
});
</script>

<template>
	<svg
		width="12"
		height="12"
		viewBox="0 0 22 22"
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
	>
		<rect
			x="6.75"
			y="12"
			width="5"
			height="2.5"
			rx="1.25"
			transform="rotate(90 6.75 12)"
			:opacity="props.active >= 1 ? 1 : 0.2"
		/>
		<rect
			x="12.25"
			y="8"
			width="9"
			height="2.5"
			rx="1.25"
			transform="rotate(90 12.25 8)"
			:opacity="props.active >= 2 ? 1 : 0.2"
		/>
		<rect
			x="17.75"
			y="5"
			width="12"
			height="2.5"
			rx="1.25"
			transform="rotate(90 17.75 5)"
			:opacity="props.active >= 3 ? 1 : 0.2"
		/>
	</svg>
</template>
