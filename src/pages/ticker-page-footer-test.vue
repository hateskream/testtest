<script setup lang="ts">
import { TickerPageFooter } from '@/modules/ticker-page';
</script>

<template>
	<ticker-page-footer :class="classes.bottom" />
</template>

<style module="classes">
.bottom {
	position: fixed;
	bottom: 0;
	left: 0;
}
</style>
