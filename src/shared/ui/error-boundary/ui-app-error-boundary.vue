<script setup lang="ts">
import { onErrorCaptured } from 'vue';

import { useLogger } from '@/shared/service/monitoring';

const logger = useLogger();

onErrorCaptured((error: Error, instance, info) => {
	logger.error('App Error', { error, context: { component: instance?.$options.name, info } });
	return false;
});
</script>

<template>
	<slot />
</template>
