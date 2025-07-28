<script setup lang="ts">
import { UiTreemap } from '@/shared/ui/treemap';

const data = [
	{ value: 2_000_000_000_001, id: 'item1' },
	{ value: 460_000_000_002, id: 'item2' },
	{ value: 117_000_000_003, id: 'item3' },
	{ value: 103_000_000_004, id: 'item4' },
	{ value: 30_000_000_005, id: 'item5' },
	{ value: 29_000_000_006, id: 'item6' },
	{ value: 14_000_000_007, id: 'item7' },
	{ value: 14_000_000_008, id: 'item8' },
	{ value: 11_000_000_009, id: 'item9' },
	{ value: 11_000_000_0010, id: 'item10' },
	{ value: 11_000_000_0011, id: 'item11' },
	{ value: 8_000_000_000, id: 'item12' },
	{ value: 6_000_000_000, id: 'item13' },
	{ value: 11_000_000_000, id: 'item14' },
	{ value: 8_000_000_000, id: 'item15' },
	{ value: 8_000_000_000, id: 'item16' },
	{ value: 2_000_000_000, id: 'item17' },
	{ value: 2_000_000_000, id: 'item18' },
	{ value: 2_000_000_000, id: 'item19' },
	{ value: 2_000_000_000, id: 'item20' },
	{ value: 2_000_000_000, id: 'item21' },
].map(item => item.value);

</script>

<template>
	<ui-treemap :data="data" />
</template>
