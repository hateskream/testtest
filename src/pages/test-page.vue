<script setup lang="ts">

import { LayoutComponent } from '@/modules/layout';
import { ExchangesDashboard } from '@/modules/widgets/exchanges';

const meta = {
	widgetId: '123',
	isResizing: false,
	isLoading: false,
	market: 'stock',
	name: 'Ajaja',
	size: { w: 2, h: 2 },
	defaultStateType: '',
	dashboards: [{
		id: 'aaa',
		name: 'aaaa',
	}],
};
</script>

<template>
	<layout-component :is-curtain-fixed="false">
		<template #content>
			<exchanges-dashboard style="max-width: 900px;" :meta="meta" />
		</template>

	</layout-component>
</template>

<style scoped>
.fear-and-greed {
	max-width: 800px;
	height: 400px;
	margin: 0 auto;
	padding: 20px;
}

.loading {
	font-style: italic;
	color: #666666;
}

.error {
	padding: 10px;
	color: #ff4444;
	background-color: #ffebee;
	border: 1px solid #ffcccc;
	border-radius: 4px;
}

.data-content {
	margin: 15px 0;
	padding: 15px;
	background-color: #f5f5f5;
	border-radius: 4px;
}

button {
	padding: 10px 20px;
	font-size: 14px;
	color: #ffffff;
	background-color: #007bff;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

button:hover:not(:disabled) {
	background-color: #0056b3;
}

button:disabled {
	background-color: #6c757d;
	cursor: not-allowed;
}
</style>
