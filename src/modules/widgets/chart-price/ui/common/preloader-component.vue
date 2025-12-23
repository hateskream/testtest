<script setup lang="ts">
import { BaseLoaderComponent } from '@/modules/widgets/base';
import type { DisplayVariant } from '@/modules/dashboard-group/layout-dashboards/model';


const props = defineProps<{
	displayVariant?: DisplayVariant;
}>();
</script>

<template>
	<base-loader-component :display-variant="props.displayVariant" />
</template>
