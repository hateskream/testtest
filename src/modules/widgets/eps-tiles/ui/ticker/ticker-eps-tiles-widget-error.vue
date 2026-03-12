<script setup lang="ts">
import { BaseErrorComponent } from '@/modules/widgets/base';
import { BaseTickerWidgetWrapper } from '@/modules/widgets/base';


const emits = defineEmits<{
	retry: [];
}>();
</script>

<template>
	<base-ticker-widget-wrapper :class="classes.container">
		<base-error-component @retry="emits('retry')" />
	</base-ticker-widget-wrapper>
</template>

<style module="classes">
.container {
	display: grid;
	width: 100%;
	height: 646px;
	place-items: center;
}
</style>
