<script setup lang="ts">
import { NominalGdpTickerWidget } from '@/modules/widgets/nominal-gdp';
</script>

<template>
	<nominal-gdp-ticker-widget :class="classes.nominal" />
</template>

<style module="classes">
.nominal {
	width: 100%;
	height: 330px;
}
</style>
