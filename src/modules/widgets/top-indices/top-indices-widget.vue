<script setup lang="ts">
import { BaseDashboardComponent } from '@/modules/widgets/base/index.ts';
import type { IMeta } from '@/modules/dashboard-group/core/index.ts';

import TopIndicesLoader from '@/modules/widgets/top-indices/ui/layouts/top-indices-loader.vue';
import TopIndicesError from '@/modules/widgets/top-indices/ui/layouts/top-indices-error.vue';
import TopIndicesMain from '@/modules/widgets/top-indices/ui/layouts/top-indices-main.vue';
import TopIndicesRcm from '@/modules/widgets/top-indices/ui/modals/top-indices-rcm.vue';


interface ITopIndicesWidgetProps {
	meta: IMeta;
}

const props = defineProps<ITopIndicesWidgetProps>();


const emit = defineEmits<{
	(e: 'delete'): void;
}>();
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			<div :class="classes.titleContainer">
				<span>{{ props.meta.name }}</span>
			</div>
		</template>

		<template #content>
			<top-indices-loader
				v-if="true"
				:count="5"
				:height="'48px'"
			/>
			<top-indices-error v-else-if="false" />

			<top-indices-main
				v-else
				:meta="props.meta"
			/>
		</template>

		<template #rcm>
			<top-indices-rcm @delete="emit('delete')" />
		</template>
	</base-dashboard-component>
</template>

<style module="classes">
.topIndicesWidget {
	display: flex;
}
</style>
