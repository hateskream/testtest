<script setup lang="ts">
import { UiTreemap } from '@/shared/ui/treemap';

const data = [
	{ ticker: 'TICK1', logoUrl: 'https://example.com/logo1.png', value: 2000000000001, percentage: 4.32 },
	{ ticker: 'TICK2', logoUrl: 'https://example.com/logo2.png', value: 460000000002, percentage: -3.17 },
	{ ticker: 'TICK3', logoUrl: 'https://example.com/logo3.png', value: 117000000003, percentage: 1.89 },
	{ ticker: 'TICK4', logoUrl: 'https://example.com/logo4.png', value: 103000000004, percentage: -4.91 },
	{ ticker: 'TICK5', logoUrl: 'https://example.com/logo5.png', value: 30000000005, percentage: 0.45 },
	{ ticker: 'TICK6', logoUrl: 'https://example.com/logo6.png', value: 29000000006, percentage: 3.77 },
	{ ticker: 'TICK7', logoUrl: 'https://example.com/logo7.png', value: 14000000007, percentage: -1.23 },
	{ ticker: 'TICK8', logoUrl: 'https://example.com/logo8.png', value: 14000000008, percentage: 2.66 },
	{ ticker: 'TICK9', logoUrl: 'https://example.com/logo9.png', value: 11000000009, percentage: -0.88 },
	{ ticker: 'TICK10', logoUrl: 'https://example.com/logo10.png', value: 11000000010, percentage: 5.00 },
	{ ticker: 'TICK11', logoUrl: 'https://example.com/logo11.png', value: 11000000011, percentage: -2.44 },
	{ ticker: 'TICK12', logoUrl: 'https://example.com/logo12.png', value: 8000000000, percentage: 1.01 },
	{ ticker: 'TICK13', logoUrl: 'https://example.com/logo13.png', value: 6000000000, percentage: -3.82 },
	{ ticker: 'TICK14', logoUrl: 'https://example.com/logo14.png', value: 11000000000, percentage: 0.33 },
	{ ticker: 'TICK15', logoUrl: 'https://example.com/logo15.png', value: 8000000000, percentage: -1.99 },
	{ ticker: 'TICK16', logoUrl: 'https://example.com/logo16.png', value: 8000000000, percentage: 4.05 },
	{ ticker: 'TICK17', logoUrl: 'https://example.com/logo17.png', value: 2000000000, percentage: -0.12 },
	{ ticker: 'TICK18', logoUrl: 'https://example.com/logo18.png', value: 2000000000, percentage: 2.21 },
	{ ticker: 'TICK19', logoUrl: 'https://example.com/logo19.png', value: 2000000000, percentage: -4.50 },
	{ ticker: 'TICK20', logoUrl: 'https://example.com/logo20.png', value: 2000000000, percentage: 1.34 },
	{ ticker: 'TICK21', logoUrl: 'https://example.com/logo21.png', value: 2000000000, percentage: -2.03 },
	{ ticker: 'TICK22', logoUrl: 'https://example.com/logo22.png', value: 9500000000, percentage: 3.11 },
	{ ticker: 'TICK23', logoUrl: 'https://example.com/logo23.png', value: 7200000000, percentage: -3.67 },
	{ ticker: 'TICK24', logoUrl: 'https://example.com/logo24.png', value: 6800000000, percentage: 0.75 },
	{ ticker: 'TICK25', logoUrl: 'https://example.com/logo25.png', value: 5500000000, percentage: -1.56 },
	{ ticker: 'TICK26', logoUrl: 'https://example.com/logo26.png', value: 5000000000, percentage: 4.88 },
	{ ticker: 'TICK27', logoUrl: 'https://example.com/logo27.png', value: 4800000000, percentage: -0.44 },
	{ ticker: 'TICK28', logoUrl: 'https://example.com/logo28.png', value: 4200000000, percentage: 2.93 },
	{ ticker: 'TICK29', logoUrl: 'https://example.com/logo29.png', value: 3900000000, percentage: -2.77 },
	{ ticker: 'TICK30', logoUrl: 'https://example.com/logo30.png', value: 3600000000, percentage: 1.67 },
	{ ticker: 'TICK31', logoUrl: 'https://example.com/logo31.png', value: 3300000000, percentage: -4.22 },
	{ ticker: 'TICK32', logoUrl: 'https://example.com/logo32.png', value: 3000000000, percentage: 0.99 },
	{ ticker: 'TICK33', logoUrl: 'https://example.com/logo33.png', value: 2800000000, percentage: -1.11 },
	{ ticker: 'TICK34', logoUrl: 'https://example.com/logo34.png', value: 2500000000, percentage: 3.40 },
	{ ticker: 'TICK35', logoUrl: 'https://example.com/logo35.png', value: 2300000000, percentage: -3.33 },
	{ ticker: 'TICK36', logoUrl: 'https://example.com/logo36.png', value: 2100000000, percentage: 1.22 },
	{ ticker: 'TICK37', logoUrl: 'https://example.com/logo37.png', value: 1900000000, percentage: -0.66 },
	{ ticker: 'TICK38', logoUrl: 'https://example.com/logo38.png', value: 1700000000, percentage: 4.19 },
	{ ticker: 'TICK39', logoUrl: 'https://example.com/logo39.png', value: 1500000000, percentage: -2.15 },
	{ ticker: 'TICK40', logoUrl: 'https://example.com/logo40.png', value: 1300000000, percentage: 0.55 },
	{ ticker: 'TICK41', logoUrl: 'https://example.com/logo41.png', value: 1100000000, percentage: -3.99 },
];

</script>

<template>
	<ui-treemap :data="data" :depth-range="{ end: -5, start: 5 }" />
</template>
