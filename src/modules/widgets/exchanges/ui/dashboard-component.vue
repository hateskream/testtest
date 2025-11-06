<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from 'vue';

import { MarketType } from '@/modules/market';
import { MarketType as ExchangeMarketType } from '../model/exchanges';
import { type IMeta } from '@/modules/dashboard-group';
import { BaseWidgetTvComponent, BaseErrorComponent } from '../../base';
import { useExchanges } from '../composables';
import { useQueryExchanges } from '../queries/use-query-exchange.ts';

import PreloaderComponent from './preloader-component.vue';
import ExchangesContextMenu from './exchanges-context-menu.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('./view-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();


const {
	columns,
	activeMarket,
	activeSort,
	resetAllChanges,
} = useExchanges(props.meta.widgetId);
type CexDex = 'CEX'|'DEX';

const cexDex = ref<CexDex>('CEX');
const viewMarket = ref<MarketType>(MarketType.Crypto);
const mapExchangeMarketIntoView = (market:ExchangeMarketType) => {
	if (market === ExchangeMarketType.CryptoCEX) {
		cexDex.value = 'CEX';
		viewMarket.value = MarketType.Crypto;
		return;
	}
	if (market === ExchangeMarketType.CryptoDEX) {
		cexDex.value = 'DEX';
		viewMarket.value = MarketType.Crypto;
		return;
	}
	if (market === ExchangeMarketType.Stock) {
		viewMarket.value = MarketType.Stock;
	}
};
const updateMarket = (cexDexVal:CexDex, viewMarketVal:MarketType) => {
	cexDex.value = cexDexVal;
	viewMarket.value = viewMarketVal;
	if (viewMarketVal === MarketType.Stock) {
		activeMarket.value = ExchangeMarketType.Stock;
	}
	if (viewMarketVal === MarketType.Crypto) {
		if (cexDexVal === 'CEX') {
			activeMarket.value = ExchangeMarketType.CryptoCEX;
		} else if (cexDex.value === 'DEX') {
			activeMarket.value = ExchangeMarketType.CryptoDEX;
		}
		return;
	}
};

watch(activeMarket, (val) => {
	mapExchangeMarketIntoView(val);
}, { immediate: true } );

const { data, isLoading, isError, refetch } = useQueryExchanges(
	activeMarket,
	activeSort,
	10,
);


const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();


const rows = computed(() => data?.value?.pages?.flatMap(page => page?.tickers).filter(t => !!t) ?? []);

const isNotData = computed(() => (!rows.value.length && isLoading.value) || props.meta.isLoading);


</script>

<template>
	<base-widget-tv-component :meta="props.meta" has-reset>
		<template #title> {{ props.meta.name }}</template>
		<template #content>
			<base-error-component
				v-if="isError"
				@retry="refetch"
			/>
			<preloader-component v-else-if="isNotData" />
			<view-component
				v-else
				v-model:columns="columns"
				:market="viewMarket"
				:cex-dex="cexDex"
				:rows="rows"
				@update:cex-dex="updateMarket($event,viewMarket)"
				@update:market="updateMarket(cexDex, $event)"
			/>
		</template>
		<template #rcm>
			<exchanges-context-menu
				v-model="columns"
				:meta="props.meta"
				:title="props.meta.name"
				@delete="emit('delete')"
				@reset="resetAllChanges"
			/>
		</template>
	</base-widget-tv-component>
</template>
