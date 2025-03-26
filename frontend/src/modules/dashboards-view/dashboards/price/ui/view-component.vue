<script setup lang="ts">
import { storeToRefs } from 'pinia';

import type { ICurrency } from '../model';
import { usePriceStore } from '../stores';

interface IViewComponentProps {
	currencies: ICurrency[];
}

const props = defineProps<IViewComponentProps>();

const { isShowChart, isShowPercentageChange, isShowLogo, isShowTicker } =
	storeToRefs(usePriceStore());
</script>

<template>data</template>
