<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';

type VariantType = 'left' | 'right';

interface IPanelComponent {
	varinat: VariantType;
}

const props = defineProps<IPanelComponent>();

const styles = computed(
	(): Partial<CSSProperties> =>
		props.varinat === 'left' ? { left: 0 } : { right: 0 },
);
</script>

<template>
	<div
		:class="classes.root"
		:style="styles"
	>
		<slot />
	</div>
</template>

<style module="classes">
.root {
	position: fixed;
	top: 0;
	bottom: 0;
	width: max-content;
	padding: 12px;
	overflow-y: auto;
}
</style>
