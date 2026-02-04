<script setup lang="ts">
import { TickerNewsWidget } from '@/modules/news';
import { useTickerContext } from '@/modules/ticker/composables';

const { tickerId } = useTickerContext();
</script>

<template>
	<ticker-news-widget :meta="{ tickerId }" />
</template>
