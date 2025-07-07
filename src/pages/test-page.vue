<script setup lang="ts">

import { ref } from 'vue';

import { LayoutComponent } from '@/modules/layout';
import { ChartComponent } from '@/modules/chart';
import { useChartStore } from '@/modules/chart/store';

import TestUsage from '@/modules/table/test-usage.vue';

const { setColor } = useChartStore();

const r = ref(0);
const g = ref(0);
const b = ref(0);
const setColors = () => {
	setColor(r.value, g.value, b.value);
};

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
