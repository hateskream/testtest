<!-- eslint-disable @stylistic/max-len -->
<script setup lang="ts">
import { UiTreemap } from '@/shared/ui/treemap';

const data = [
	{ price: 10000000, ticker: 'TICK1', logoUrl: 'https://example.com/logo1.png', sizeValue: 2000000000001, colorValue: 4.32 },
	{ price: 10000000, ticker: 'TICK2', logoUrl: 'https://example.com/logo2.png', sizeValue: 460000000002, colorValue: -3.17 },
	{ price: 10000000, ticker: 'TICK3', logoUrl: 'https://example.com/logo3.png', sizeValue: 117000000003, colorValue: 1.89 },
	{ price: 10000000, ticker: 'TICK4', logoUrl: 'https://example.com/logo4.png', sizeValue: 103000000004, colorValue: -4.91 },
	{ price: 10000000, ticker: 'TICK5', logoUrl: 'https://example.com/logo5.png', sizeValue: 30000000005, colorValue: 0.45 },
	{ price: 10000000, ticker: 'TICK6', logoUrl: 'https://example.com/logo6.png', sizeValue: 29000000006, colorValue: 3.77 },
	{ price: 10000000, ticker: 'TICK7', logoUrl: 'https://example.com/logo7.png', sizeValue: 14000000007, colorValue: -1.23 },
	{ price: 10000000, ticker: 'TICK8', logoUrl: 'https://example.com/logo8.png', sizeValue: 14000000008, colorValue: 2.66 },
	{ price: 10000000, ticker: 'TICK9', logoUrl: 'https://example.com/logo9.png', sizeValue: 11000000009, colorValue: -0.88 },
	{ price: 10000000, ticker: 'TICK10', logoUrl: 'https://example.com/logo10.png', sizeValue: 11000000010, colorValue: 5.00 },
	{ price: 10000000, ticker: 'TICK11', logoUrl: 'https://example.com/logo11.png', sizeValue: 11000000011, colorValue: -2.44 },
	{ price: 10000000, ticker: 'TICK12', logoUrl: 'https://example.com/logo12.png', sizeValue: 8000000000, colorValue: 1.01 },
	{ price: 10000000, ticker: 'TICK13', logoUrl: 'https://example.com/logo13.png', sizeValue: 6000000000, colorValue: -3.82 },
	{ price: 10000000, ticker: 'TICK14', logoUrl: 'https://example.com/logo14.png', sizeValue: 11000000000, colorValue: 0.33 },
	{ price: 10000000, ticker: 'TICK15', logoUrl: 'https://example.com/logo15.png', sizeValue: 8000000000, colorValue: -1.99 },
	{ price: 10000000, ticker: 'TICK16', logoUrl: 'https://example.com/logo16.png', sizeValue: 8000000000, colorValue: 4.05 },
	{ price: 10000000, ticker: 'TICK17', logoUrl: 'https://example.com/logo17.png', sizeValue: 2000000000, colorValue: -0.12 },
	{ price: 10000000, ticker: 'TICK18', logoUrl: 'https://example.com/logo18.png', sizeValue: 2000000000, colorValue: 2.21 },
	{ price: 10000000, ticker: 'TICK19', logoUrl: 'https://example.com/logo19.png', sizeValue: 2000000000, colorValue: -4.50 },
	{ price: 10000000, ticker: 'TICK20', logoUrl: 'https://example.com/logo20.png', sizeValue: 2000000000, colorValue: 1.34 },
	{ price: 10000000, ticker: 'TICK21', logoUrl: 'https://example.com/logo21.png', sizeValue: 2000000000, colorValue: -2.03 },
	{ price: 10000000, ticker: 'TICK22', logoUrl: 'https://example.com/logo22.png', sizeValue: 9500000000, colorValue: 3.11 },
	{ price: 10000000, ticker: 'TICK23', logoUrl: 'https://example.com/logo23.png', sizeValue: 7200000000, colorValue: -3.67 },
	{ price: 10000000, ticker: 'TICK24', logoUrl: 'https://example.com/logo24.png', sizeValue: 6800000000, colorValue: 0.75 },
	{ price: 10000000, ticker: 'TICK25', logoUrl: 'https://example.com/logo25.png', sizeValue: 5500000000, colorValue: -1.56 },
	{ price: 10000000, ticker: 'TICK26', logoUrl: 'https://example.com/logo26.png', sizeValue: 5000000000, colorValue: 4.88 },
	{ price: 10000000, ticker: 'TICK27', logoUrl: 'https://example.com/logo27.png', sizeValue: 4800000000, colorValue: -0.44 },
	{ price: 10000000, ticker: 'TICK28', logoUrl: 'https://example.com/logo28.png', sizeValue: 4200000000, colorValue: 2.93 },
	{ price: 10000000, ticker: 'TICK29', logoUrl: 'https://example.com/logo29.png', sizeValue: 3900000000, colorValue: -2.77 },
	{ price: 10000000, ticker: 'TICK30', logoUrl: 'https://example.com/logo30.png', sizeValue: 3600000000, colorValue: 1.67 },
	{ price: 10000000, ticker: 'TICK31', logoUrl: 'https://example.com/logo31.png', sizeValue: 3300000000, colorValue: -4.22 },
	{ price: 10000000, ticker: 'TICK32', logoUrl: 'https://example.com/logo32.png', sizeValue: 3000000000, colorValue: 0.99 },
	{ price: 10000000, ticker: 'TICK33', logoUrl: 'https://example.com/logo33.png', sizeValue: 2800000000, colorValue: -1.11 },
	{ price: 10000000, ticker: 'TICK34', logoUrl: 'https://example.com/logo34.png', sizeValue: 2500000000, colorValue: 3.40 },
	{ price: 10000000, ticker: 'TICK35', logoUrl: 'https://example.com/logo35.png', sizeValue: 2300000000, colorValue: -3.33 },
	{ price: 10000000, ticker: 'TICK36', logoUrl: 'https://example.com/logo36.png', sizeValue: 2100000000, colorValue: 1.22 },
	{ price: 10000000, ticker: 'TICK37', logoUrl: 'https://example.com/logo37.png', sizeValue: 1900000000, colorValue: -0.66 },
	{ price: 10000000, ticker: 'TICK38', logoUrl: 'https://example.com/logo38.png', sizeValue: 1700000000, colorValue: 4.19 },
	{ price: 10000000, ticker: 'TICK39', logoUrl: 'https://example.com/logo39.png', sizeValue: 1500000000, colorValue: -2.15 },
	{ price: 10000000, ticker: 'TICK40', logoUrl: 'https://example.com/logo40.png', sizeValue: 1300000000, colorValue: 0.55 },
	{ price: 10000000, ticker: 'TICK41', logoUrl: 'https://example.com/logo41.png', sizeValue: 1100000000, colorValue: -3.99 },
];

</script>

<template>
	<ui-treemap
		:data="data"
		:depth-range="{ end: -5, start: 5 }"
		:visible-config="{
			isShowLogo: true,
			isShowTicker: true,
			isPercent: true,
		}"
		:currency-symbol="'$'"
		:size-by="'SizeValue'"
		:color-by="'ColorValue'"
	/>
</template>
