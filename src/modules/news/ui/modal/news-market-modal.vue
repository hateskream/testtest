<script setup lang="ts">
import { ModalBadgeList, ModalItemSelector } from '@/modules/widgets/base';
import { getAllMarkets, type MarketType } from '@/modules/market';
import { toggleFilter } from '@/modules/news';

defineProps<{
	displayVariant: 'default' | 'new';
}>();

const market = defineModel<Set<MarketType>>('market', { required: true });

function toggleSegment(segment: MarketType) {
	market.value = toggleFilter(market.value, segment);
}
</script>

<template>
	<modal-badge-list :display-variant>
		<modal-item-selector
			v-for="{type, label} in getAllMarkets()"
			:key="type"
			:model-value="market.has(type)"
			@click="toggleSegment(type)"
		>
			{{ label }}
		</modal-item-selector>
	</modal-badge-list>
</template>

<style module="classes">

</style>
