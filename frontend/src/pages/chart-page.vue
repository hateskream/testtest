<script setup lang="ts">

import { LayoutComponent } from '@/modules/layout';
import { ChartHeader, ChartLayout } from '@/modules/chart';




</script>

<template>
	<layout-component>

		<template #content>
			<chart-layout>
				<template #header>
					<chart-header />
				</template>
			</chart-layout>
		</template>
	</layout-component>
</template>
