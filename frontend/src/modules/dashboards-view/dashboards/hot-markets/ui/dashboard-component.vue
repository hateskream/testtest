<script setup lang="ts">
import type { IMeta } from '@/modules/dashboards-view/group/model/widgets.ts';
import { BaseDashboardComponent } from '../../base/index.ts';

interface IDashboardComponentProps {
	meta: IMeta;
}

const props = defineProps<IDashboardComponentProps>();
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			<div>{{ props.meta.name }}</div>
		</template>
	</base-dashboard-component>
</template>
