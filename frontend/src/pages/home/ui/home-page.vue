<script setup lang="ts">
import { TabsComponent } from '@/modules/dashboards-view/group';
import { LayoutComponent } from '@/modules/layaout';
</script>

<template>
	<layout-component>
		<template #header>
			<tabs-component />
		</template>
		<template #content>
			<div />
		</template>
	</layout-component>
</template>
