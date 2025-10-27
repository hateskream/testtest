<script setup lang="ts">

import { LayoutDashboard } from '@/modules/dashboard-group/layout-dashboards';
import { LayoutComponent } from '@/modules/layout';

</script>

<template>
	<layout-component :is-curtain-fixed="false">
		<template #content>
			<layout-dashboard />
		</template>
	</layout-component>
</template>
