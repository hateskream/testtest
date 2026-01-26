<script setup lang="ts">
import { BaseTickerWidgetError } from '@/modules/widgets/base';

const emits = defineEmits<{
	retry: [];
}>();
</script>

<template>
	<base-ticker-widget-error @retry="emits('retry')" />
</template>
