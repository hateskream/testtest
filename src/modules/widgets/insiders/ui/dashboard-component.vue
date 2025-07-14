<script setup lang="ts">
import type { IMeta } from '@/modules/dashboard-group';
import { BaseDashboardComponent } from '../../base/index.ts';

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			{{ props.meta.name }}
		</template>
	</base-dashboard-component>
</template>
