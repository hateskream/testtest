<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';

import { AppLayout } from '@/modules/layout';
import { createTickerIdFromType, TickerComponent } from '@/modules/ticker';
import { RouteNames, RouteTickerType } from '@/types/route.d';
import { TickerType } from '@/modules/ticker/models';
import { fetchTickers, type ITickerItem } from '@/modules/ticker-selector';
import { useLogger } from '@/shared/service/monitoring';
import { useAppHead } from '@/shared/composables';
import { capitalize } from '@/shared/lib/capitalize.ts';

interface ITickerPageProps {
	id: string;
	type: RouteTickerType;
}

const props = defineProps<ITickerPageProps>();

const tickerType = computed((): TickerType => {
	const mapping: Record<RouteTickerType, TickerType> = {
		[RouteTickerType.CRYPTO]: TickerType.CRYPTO,
		[RouteTickerType.STOCK]: TickerType.STOCK,
		[RouteTickerType.FOREX]: TickerType.FOREX,
		[RouteTickerType.COMMODITIES]: TickerType.COMMODITIES,
		[RouteTickerType.INDICES]: TickerType.INDICES,
		[RouteTickerType.ETF]: TickerType.ETF,
	};

	return mapping[props.type];
});

const router = useRouter();
const logger = useLogger();

const canonicalTickerId = computed(() => createTickerIdFromType(props.type, props.id));

const ticker = shallowRef<ITickerItem | null>(null);

async function fetchTicker(tickerId: string) {
	try {
		const [response] = await fetchTickers(tickerId);

		ticker.value = response;
	} catch (error) {
		logger.error('Invalid TickerId', { error: error as Error, context: { tickerId } });
		ticker.value = null;
		void router.replace({ name: RouteNames.Error });
	}
}

watch(canonicalTickerId, tickerId => {
	if (tickerId) {
		fetchTicker(tickerId);
	} else {
		router.replace({ name: RouteNames.Error });
	}
}, { immediate: true });

const title = computed(() => {
	if (ticker.value) {
		return `${ticker.value.name} — ${capitalize(ticker.value.market_type)}`;
	}

	return 'Ticker Page';
});

useAppHead({ title });
</script>

<template>
	<app-layout :active-ticker="ticker">
		<div :class="classes.container">
			<ticker-component :id="props.id" :type="tickerType" />
		</div>
	</app-layout>
</template>

<style module="classes">
.container {
	height: calc(100vh - 16px);
	margin: 8px 0;
	border-radius: 18px;

	@media (width > 655px) {
		border: 1px solid #1d1d1e;
	}
}
</style>
