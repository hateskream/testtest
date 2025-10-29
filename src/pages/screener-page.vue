<script setup lang="ts">
import { LayoutComponent } from '@/modules/layout';
import { UiSearch } from '@/shared/ui/input';
import { RouteScreenerType } from '@/types/route.d';

interface IScreenerPageProps {
	type: RouteScreenerType;
}

defineProps<IScreenerPageProps>();
</script>

<template>
	<layout-component :is-curtain-fixed="false">
		<template #header>
			<div>
				<ui-search
					:class="classes.search"
					placeholder="Search APPL, S&P 500..."
				/>
			</div>
		</template>
		<template #content>
			<div :class="classes.root">
				<h2 :class="classes.title">Screener</h2>
			</div>
		</template>
	</layout-component>
</template>

<style module="classes">
.search {
	border: 1px solid var(--border-color-surface-02);
	border-radius: 9999px;
	padding: 12px;
	width: 300px;
}

.root {
	display: flex;
	flex-direction: column;
	max-width: 100%;
}

.title {
	margin: 16px 0;
}
</style>
