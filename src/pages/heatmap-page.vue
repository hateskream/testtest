<script setup lang="ts">
import { TreemapComponent } from '@/modules/treemap/ui';
import { LayoutComponent } from '@/modules/layout';

</script>

<template>
	<layout-component :is-curtain-fixed="false">
		<template #header>
			<div :class="classes.header">Heatmap</div>
		</template>
		<template #content>

			<treemap-component />
		</template>
	</layout-component>
</template>

<style module="classes">
.header {
	font-style: normal;
	font-weight: 340;
	font-size: 36px;
	line-height: 100%;
	color: var(--text-color-base-500);
}
</style>
