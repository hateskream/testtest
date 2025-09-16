<script setup lang="ts">
import { ref, onMounted } from 'vue';

import { LayoutComponent } from '@/modules/layout';


// Reactive state
const data = ref(null);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

// Fetch function
const fetchData = async () => {
	try {
		loading.value = true;
		error.value = null;

		// Запрос через прокси
		const response = await fetch('/api/v1/fear-and-greed/data');

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const result = await response.json();
		data.value = result;
		console.log('Data received:', result);

	} catch (err) {
		error.value = err instanceof Error ? err.message : 'Unknown error occurred';
		console.error('Fetch error:', err);
	} finally {
		loading.value = false;
	}
};

// Fetch data when component mounts
onMounted(() => {
	fetchData();
});

const test = ref(true);
</script>

<template>
	<layout-component v-model:is-curtain-fixed="test" :is-edit-mode="false">
		<template #content>
			<div class="fear-and-greed">
				<h2>Fear & Greed Index</h2>

				<!-- Loading state -->
				<div v-if="loading" class="loading">
					Loading data...
				</div>

				<!-- Error state -->
				<div v-else-if="error" class="error">
					Error: {{ error }}
				</div>

				<!-- Success state -->
				<div v-else-if="data" class="data-content">
					<pre>{{ data }}</pre>
				</div>

				<!-- Button to refresh data -->
				<button :disabled="loading" @click="fetchData">
					{{ loading ? 'Loading...' : 'Refresh Data' }}
				</button>
			</div>
		</template>
		<template #curtain>
			<div
				:style="{
					width: '429px',
					background: 'red',
					height: '100%',
				}"
			>
			</div>
		</template>
	</layout-component>
</template>

<style scoped>
.fear-and-greed {
	max-width: 800px;
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
