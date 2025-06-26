<script setup lang="ts">
import { computed } from 'vue';

import { RangeChart } from '../model/chart';

interface IChartRangeProps {
	activeRange: RangeChart;
	list: RangeChart[];
}

const props = defineProps<IChartRangeProps>();

interface IChartRangeEmits {
	(e: 'select', data: RangeChart): void;
}

const emits = defineEmits<IChartRangeEmits>();

const ranges = computed(() => {
	return props.list.map((item) => ({
		title: item,
		val: item,
	}));
});


</script>

<template>
	<div :class="'range'">
		<div
			v-for="item in ranges"
			:key="item.val"
			:class="['rangeItem', { ['rangeItemActive']: activeRange === item.val }]"
			@click="emits('select', item.val)"
		>
			{{ item.title }}
		</div>
	</div>
</template>


<style scoped>
.range {
	display: flex;
	align-items: center;
	width: 100%;
	padding: 2px;
	background-color: rgb(50 50 52 / 50%);
	border-radius: 14px;
}

.rangeItem {
	flex: auto;
	padding: 6px 8px;
	text-align: center;
	border-radius: 16px;
	cursor: pointer;
}

.rangeItemActive {
	background-color: var(--bg-color-base-300-activated);
}
</style>
