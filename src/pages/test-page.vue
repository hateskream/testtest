<script setup lang="ts">


import { LayoutComponent } from '@/modules/layout';

import TestUsage from '@/modules/table/test-usage.vue';


</script>

<template>
	<layout-component :is-curtain-fixed="false">
		<template #content>
			<test-usage />
		</template>
	</layout-component>

</template>

<style module="classes">
.wrapper {
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 10;

	input {
		width: 30px;
	}

	button {
		background: var(--text-color-base-300);
	}
}
</style>
