<script setup lang="ts">

</script>

<template>
	<div :class="classes.wrapper" data-pill-wrapper>
		<slot />
	</div>
</template>

<style module="classes">
.wrapper {
	display: grid;
	align-items: stretch;
	width: 100%;
	padding: 4px 12px;
	gap: var(--padding-padding-s1, 1px);
	grid-auto-flow: column;
	grid-auto-columns: minmax(0, 1fr);
}

:global([data-modal-wrapper] > [data-pill-wrapper]) {
	padding: 6px 12px;
}

:global([data-pill-wrapper] > [data-pill-item]:only-child) {
	width: 50%;
}

:global([data-pill-wrapper] > [data-pill-item]:first-child:not(:only-child)) {
	border-top-left-radius: var(--control-ct-sm28-radius, 10.8px);
	border-bottom-left-radius: var(--control-ct-sm28-radius, 10.8px);
}

:global([data-pill-wrapper] > [data-pill-item]:last-child:not(:only-child)) {
	border-top-right-radius: var(--control-ct-sm28-radius, 10.8px);
	border-bottom-right-radius: var(--control-ct-sm28-radius, 10.8px);
}
</style>
