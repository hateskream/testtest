<script setup lang="ts">
import { MarketBadge } from '../../base';
import { UiDelimiter } from '@/shared/ui/delimiter';
import { MarketType } from '@/modules/market';

const market = defineModel<MarketType>('market', { required: true });
const cexDex = defineModel<'CEX' | 'DEX'>('cexDex', { required: true });
const excludeMarkets:MarketType[] = [
	MarketType.Commodities, MarketType.Forex, MarketType.Indices,
];

</script>

<template>
	<div :class="classes.container">
		<market-badge
			v-model="market"
			title="Categories"
			:exclude-markets="excludeMarkets"
		/>
		<template v-if="market !== 'stock'">
			<div :class="classes.lineDelimiterGroup">
				<ui-delimiter />
				<ui-delimiter />
			</div>
			<div :class="classes.cexDexTabs">
				<div
					:class="[classes.tab, { [classes.tabActive]: cexDex === 'CEX' }]"
					@click="cexDex = 'CEX'"
				>
					CEX
				</div>
				<div
					:class="[classes.tab, { [classes.tabActive]: cexDex === 'DEX' }]"
					@click="cexDex = 'DEX'"
				>
					DEX
				</div>
			</div>
		</template>
	</div>
</template>

<style module="classes">
.lineDelimiterGroup {
	display: flex;
	align-items: center;
	gap: 6px;
}

.container {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 8px;
}

.cexDexTabs {
	display: flex;
	align-items: center;
	width: max-content;
	padding: 4px;
	background: var(--bg-color-base-300, #2a2a2a);
	border-radius: 24px;
	gap: 2px;
}

.tab {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 20px;
	padding: 8px 16px;
	font-weight: 500;
	font-size: 10px;
	color: var(--text-color-base-300, #888888);
	letter-spacing: 0.04px;
	border-radius: 20px;
	cursor: pointer;
	transition: all 0.2s ease;
	user-select: none;
}

.tabActive {
	color: var(--text-color-primary, #ffffff);
	background: var(--bg-color-base-300-activated, #444444);
	pointer-events: none;
}

.iconAllFilter {
	cursor: pointer;
}

.iconGainersColor {
	color: rgb(206 255 139 / 100%);
}

.iconLoosersColor {
	color: rgb(248 89 97 / 50%);
}

.tabs {
	display: flex;
	align-items: center;
	width: max-content;
	padding: 2px;
	background: var(--bg-color-base-300);
	border-radius: 9999px;
	gap: 2px;
}

.iconWrapper {
	flex: 14px;
	cursor: pointer;
}

.iconAllFilterColor {
	color: var(--icon-color-base-300);
}
</style>
