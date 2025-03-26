<script setup lang="ts">
import type { ICurrency } from '../model';

import CellComponent from './cell-component.vue';

interface IViewComponentProps {
	currencies: ICurrency[];
}

const props = defineProps<IViewComponentProps>();
</script>

<template>
	<div>
		<cell-component
			v-for="currency in props.currencies"
			:key="currency.ticker"
			:currency="currency"
		/>
	</div>
</template>

<style module="classes"></style>
