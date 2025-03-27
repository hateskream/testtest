<script setup lang="ts">
import { BaseDashboardComponent } from '@/modules/dashboards-view/dashboards/base';
import {
	ErrorComponent,
	PreloaderComponent,
	PriceDashboard,
	SettingsComponent,
} from '@/modules/dashboards-view/dashboards/price';
import { TabsComponent } from '@/modules/dashboards-view/group';
import { LayoutComponent } from '@/modules/layaout';
</script>

<template>
	<layout-component>
		<template #header>
			<tabs-component />
		</template>
		<template #content>
			<div :class="classes.root">
				<base-dashboard-component>
					<template #title>Price</template>
					<template #content>
						<error-component />
					</template>
				</base-dashboard-component>
				<base-dashboard-component>
					<template #title>Price</template>
					<template #content>
						<preloader-component />
					</template>
				</base-dashboard-component>
				<div :class="classes.container">
					<div :class="classes.first">
						<price-dashboard :market="'market'" />
					</div>
					<div>
						<settings-component />
					</div>
				</div>
			</div>
		</template>
	</layout-component>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	gap: 30px;
	margin-bottom: 300px;
}

.container {
	display: flex;
	gap: 20px;
}

.first {
	max-width: 310px;
}

.second {
	width: 208px;
}
</style>
