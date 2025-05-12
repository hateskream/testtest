<script setup lang="ts">
import type { IMeta } from '@/modules/dashboard-group/model/widgets.ts';
import { BaseDashboardComponent } from '../../base/index.ts';

const props = defineProps<{meta: IMeta}>();
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			{{ props.meta.name }}
		</template>
	</base-dashboard-component>
</template>
