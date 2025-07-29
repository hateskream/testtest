<script setup lang="ts">
import { UiTreemap } from '@/shared/ui/treemap';

const data = [
	{
		ticker: 'TICK1',
		logoUrl: 'https://example.com/logo1.png',
		value: 2000000000001,
		percentage: 66.49,
	},
	{
		ticker: 'TICK2',
		logoUrl: 'https://example.com/logo2.png',
		value: 460000000002,
		percentage: 15.29,
	},
	{
		ticker: 'TICK3',
		logoUrl: 'https://example.com/logo3.png',
		value: 117000000003,
		percentage: 3.89,
	},
	{
		ticker: 'TICK4',
		logoUrl: 'https://example.com/logo4.png',
		value: 103000000004,
		percentage: 3.42,
	},
	{
		ticker: 'TICK5',
		logoUrl: 'https://example.com/logo5.png',
		value: 30000000005,
		percentage: 1.00,
	},
	{
		ticker: 'TICK6',
		logoUrl: 'https://example.com/logo6.png',
		value: 29000000006,
		percentage: 0.96,
	},
	{
		ticker: 'TICK7',
		logoUrl: 'https://example.com/logo7.png',
		value: 14000000007,
		percentage: 0.46,
	},
	{
		ticker: 'TICK8',
		logoUrl: 'https://example.com/logo8.png',
		value: 14000000008,
		percentage: 0.46,
	},
	{
		ticker: 'TICK9',
		logoUrl: 'https://example.com/logo9.png',
		value: 11000000009,
		percentage: 0.37,
	},
	{
		ticker: 'TICK10',
		logoUrl: 'https://example.com/logo10.png',
		value: 11000000010,
		percentage: 0.37,
	},
	{
		ticker: 'TICK11',
		logoUrl: 'https://example.com/logo11.png',
		value: 11000000011,
		percentage: 0.37,
	},
	{
		ticker: 'TICK12',
		logoUrl: 'https://example.com/logo12.png',
		value: 8000000000,
		percentage: 0.27,
	},
	{
		ticker: 'TICK13',
		logoUrl: 'https://example.com/logo13.png',
		value: 6000000000,
		percentage: 0.20,
	},
	{
		ticker: 'TICK14',
		logoUrl: 'https://example.com/logo14.png',
		value: 11000000000,
		percentage: 0.37,
	},
	{
		ticker: 'TICK15',
		logoUrl: 'https://example.com/logo15.png',
		value: 8000000000,
		percentage: 0.27,
	},
	{
		ticker: 'TICK16',
		logoUrl: 'https://example.com/logo16.png',
		value: 8000000000,
		percentage: 0.27,
	},
	{
		ticker: 'TICK17',
		logoUrl: 'https://example.com/logo17.png',
		value: 2000000000,
		percentage: 0.07,
	},
	{
		ticker: 'TICK18',
		logoUrl: 'https://example.com/logo18.png',
		value: 2000000000,
		percentage: 0.07,
	},
	{
		ticker: 'TICK19',
		logoUrl: 'https://example.com/logo19.png',
		value: 2000000000,
		percentage: 0.07,
	},
	{
		ticker: 'TICK20',
		logoUrl: 'https://example.com/logo20.png',
		value: 2000000000,
		percentage: 0.07,
	},
	{
		ticker: 'TICK21',
		logoUrl: 'https://example.com/logo21.png',
		value: 2000000000,
		percentage: 0.07,
	},
];

</script>

<template>
	<ui-treemap :data="data" />
</template>
