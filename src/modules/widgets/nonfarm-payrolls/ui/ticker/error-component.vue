<script setup lang="ts">
import { BaseTickerWidgetWrapper, BaseErrorComponent } from '@/modules/widgets/base';

const emits = defineEmits<{
	retry: [];
}>();
</script>

<template>
	<base-ticker-widget-wrapper :class="classes.wrapper">
		<base-error-component @retry="emits('retry')" />
	</base-ticker-widget-wrapper>
</template>

<style module="classes">
.wrapper {
	height: 200px;
}
</style>
