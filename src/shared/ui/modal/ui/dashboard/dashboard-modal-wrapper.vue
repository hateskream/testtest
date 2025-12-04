<script setup lang="ts">
import { useProvideDisplayVariant } from '../../composables';

useProvideDisplayVariant('new');
</script>

<template>
	<div :class="classes.wrapper" data-modal-wrapper>
		<slot />
	</div>
</template>

<style module="classes">
.wrapper {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	box-sizing: border-box;
	min-width: 230px;
	max-height: 80svh;
	margin: 0;
	padding: 0;
	background: var(--surface-modal, rgb(30 30 32 / 88%));
	border: 1px solid var(--border-surf-04, rgb(73 73 80 / 32%));
	border-radius: var(--radius-radius-s17-44, 17.2px);
	backdrop-filter: blur(18px);
	user-select: none;
}
</style>
